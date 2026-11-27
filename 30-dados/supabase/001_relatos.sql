-- Relatos colaborativos (estilo Waze). Desenho: 30-dados/relatos-colaborativos.md · Decisão: D-011.
-- Segurança: o navegador NUNCA mexe nas tabelas. RLS ligado e sem política nenhuma:
-- tudo passa pelas 3 funções abaixo, que checam as regras no servidor.

create table public.estacoes (
  id  text primary key,              -- igual ao id do site: "1-se"
  lat double precision not null,
  lon double precision not null
);

create table public.relatos (
  id         uuid primary key default gen_random_uuid(),
  estacao_id text not null references public.estacoes(id),
  tipo       text not null check (tipo in ('elevador','escada-rolante','banheiro','rampa','piso-tatil','outro')),
  comentario text check (char_length(comentario) <= 200),
  aparelho   uuid not null,             -- ID anônimo do navegador; nunca sai do banco
  criado_em  timestamptz not null default now(),
  -- Some sozinho 3 h depois do último "ainda está assim", e nunca passa de 24 h desde o aviso
  -- (pedido do Enzo: aviso velho confunde, a coisa já pode ter voltado ao normal).
  valido_ate timestamptz not null default now() + interval '3 hours',
  resolvido_em timestamptz,
  check (valido_ate <= criado_em + interval '24 hours')
);
create index relatos_ativos_idx on public.relatos (estacao_id) where resolvido_em is null;

create table public.relato_votos (
  relato_id uuid not null references public.relatos(id) on delete cascade,
  aparelho  uuid not null,
  voto      text not null check (voto in ('ainda','resolveu')),
  criado_em timestamptz not null default now(),
  primary key (relato_id, aparelho)     -- um voto por aparelho em cada relato
);

alter table public.estacoes     enable row level security;
alter table public.relatos      enable row level security;
alter table public.relato_votos enable row level security;

-- Distância em metros entre dois pontos (fórmula de haversine).
create function public.distancia_m(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision)
returns double precision language sql immutable set search_path = '' as $$
  select 2 * 6371000 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) +
    cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lon2 - lon1) / 2), 2)))
$$;

-- Quem está a até 500 m do ponto da estação conta como "na estação".
-- 500 e não 100: o ponto do GeoSampa é o centro da estação, as saídas ficam longe dele,
-- e no subsolo o celular acha a posição pelo wi-fi e pela antena, com erro de centenas de metros.
create function public.na_estacao(p_estacao text, p_lat double precision, p_lon double precision)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select public.distancia_m(e.lat, e.lon, p_lat, p_lon) <= 500
                   from public.estacoes e where e.id = p_estacao), false)
$$;

-- Leitura: relatos ativos das estações pedidas (null = todas), sem o ID do aparelho.
create function public.relatos_ativos(p_estacoes text[] default null)
returns table (id uuid, estacao_id text, tipo text, comentario text, criado_em timestamptz,
               valido_ate timestamptz, confirmacoes int, resolveu int)
language sql stable security definer set search_path = '' as $$
  select r.id, r.estacao_id, r.tipo, r.comentario, r.criado_em, r.valido_ate,
         (select count(*) from public.relato_votos v where v.relato_id = r.id and v.voto = 'ainda')::int,
         (select count(*) from public.relato_votos v where v.relato_id = r.id and v.voto = 'resolveu')::int
  from public.relatos r
  where r.resolvido_em is null and r.valido_ate > now()
    and (p_estacoes is null or r.estacao_id = any (p_estacoes))
  order by r.criado_em desc
$$;

-- Avisar um problema. Se já existe aviso ativo do mesmo tipo na estação, vira confirmação dele.
create function public.criar_relato(p_estacao text, p_tipo text, p_comentario text, p_aparelho uuid,
                                    p_lat double precision, p_lon double precision)
returns uuid language plpgsql volatile security definer set search_path = '' as $$
declare
  v_existente uuid;
  v_novo uuid;
  v_texto text := nullif(btrim(p_comentario), '');
begin
  if not public.na_estacao(p_estacao, p_lat, p_lon) then
    raise exception 'longe_da_estacao' using errcode = 'P0001';
  end if;
  if p_tipo = 'outro' and v_texto is null then
    raise exception 'comentario_obrigatorio' using errcode = 'P0001';
  end if;
  -- Contra spam: no máximo 5 avisos por aparelho por hora.
  if (select count(*) from public.relatos where aparelho = p_aparelho and criado_em > now() - interval '1 hour') >= 5 then
    raise exception 'muitos_avisos' using errcode = 'P0001';
  end if;

  select id into v_existente from public.relatos
  where estacao_id = p_estacao and tipo = p_tipo and p_tipo <> 'outro'
    and resolvido_em is null and valido_ate > now()
  limit 1;

  if v_existente is not null then
    if not exists (select 1 from public.relatos where id = v_existente and aparelho = p_aparelho) then
      insert into public.relato_votos (relato_id, aparelho, voto) values (v_existente, p_aparelho, 'ainda')
      on conflict (relato_id, aparelho) do update set voto = 'ainda', criado_em = now();
    end if;
    update public.relatos set valido_ate = least(now() + interval '3 hours', criado_em + interval '24 hours') where id = v_existente;
    return v_existente;
  end if;

  insert into public.relatos (estacao_id, tipo, comentario, aparelho)
  values (p_estacao, p_tipo, left(v_texto, 200), p_aparelho)
  returning id into v_novo;
  return v_novo;
end $$;

-- "Ainda está assim" renova por 3 horas (até o teto de 24 h); dois "já resolveu" derrubam o aviso.
create function public.votar_relato(p_relato uuid, p_voto text, p_aparelho uuid,
                                    p_lat double precision, p_lon double precision)
returns void language plpgsql volatile security definer set search_path = '' as $$
declare
  v_relato public.relatos;
begin
  select * into v_relato from public.relatos
  where id = p_relato and resolvido_em is null and valido_ate > now();
  if not found then raise exception 'aviso_encerrado' using errcode = 'P0001'; end if;
  if not public.na_estacao(v_relato.estacao_id, p_lat, p_lon) then
    raise exception 'longe_da_estacao' using errcode = 'P0001';
  end if;
  if p_voto not in ('ainda', 'resolveu') then raise exception 'voto_invalido' using errcode = 'P0001'; end if;
  -- Quem avisou pode dizer que resolveu (derruba na hora), mas não pode confirmar o próprio aviso.
  if v_relato.aparelho = p_aparelho then
    if p_voto = 'resolveu' then
      update public.relatos set resolvido_em = now() where id = p_relato;
      return;
    end if;
    raise exception 'proprio_aviso' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.relato_votos where relato_id = p_relato and aparelho = p_aparelho) then
    raise exception 'ja_votou' using errcode = 'P0001';
  end if;

  insert into public.relato_votos (relato_id, aparelho, voto) values (p_relato, p_aparelho, p_voto);
  if p_voto = 'ainda' then
    update public.relatos set valido_ate = least(now() + interval '3 hours', criado_em + interval '24 hours') where id = p_relato;
  elsif (select count(*) from public.relato_votos where relato_id = p_relato and voto = 'resolveu') >= 2 then
    update public.relatos set resolvido_em = now() where id = p_relato;
  end if;
end $$;

-- Só as 3 funções ficam abertas para o site; o resto fica fechado.
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.relatos_ativos(text[]) to anon, authenticated;
grant execute on function public.criar_relato(text, text, text, uuid, double precision, double precision) to anon, authenticated;
grant execute on function public.votar_relato(uuid, text, uuid, double precision, double precision) to anon, authenticated;

-- Tabelas fechadas de vez para o site: sem isso o RLS devolve lista vazia, com isso dá erro de permissão.
revoke all on public.estacoes, public.relatos, public.relato_votos from anon, authenticated;
