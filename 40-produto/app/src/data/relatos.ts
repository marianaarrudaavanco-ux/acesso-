/**
 * Relatos colaborativos (estilo Waze): quem está na estação avisa "elevador parado",
 * e quem passa depois confirma ou diz que já resolveu. Regras: 30-dados/relatos-colaborativos.md.
 *
 * Falamos com o Supabase por fetch puro (sem a biblioteca supabase-js): são só 3 chamadas,
 * e assim o site não carrega mais 50 kB. Todas as regras (distância, prazo, um voto por
 * aparelho) moram no banco, em 30-dados/supabase/001_relatos.sql. O navegador só pede.
 */
import { useCallback, useEffect, useState } from 'react'
import type { Posicao } from '../mapa/geo'
import { ESTACOES, type Estacao } from './estacoes'

const URL_SUPABASE = import.meta.env.VITE_SUPABASE_URL as string | undefined
const CHAVE_PUBLICA = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

/** Sem as variáveis de ambiente (ex.: rodando local sem .env.local), a parte de avisos some com um aviso. */
export const RELATOS_LIGADOS = Boolean(URL_SUPABASE && CHAVE_PUBLICA)

/** A Sé da Linha 1 e a da Linha 3 são o mesmo lugar: os avisos aparecem nas duas páginas. */
export function idsDoMesmoLugar(estacao: Estacao): string[] {
  return ESTACOES.filter((e) => e.nome === estacao.nome).map((e) => e.id)
}

/** Até onde conta como "na estação". Igual ao banco (função na_estacao). */
export const RAIO_ESTACAO_M = 500

export type TipoRelato = 'elevador' | 'escada-rolante' | 'banheiro' | 'rampa' | 'piso-tatil' | 'outro'

export const TIPOS_RELATO: { tipo: TipoRelato; texto: string }[] = [
  { tipo: 'elevador', texto: 'Elevador parado' },
  { tipo: 'escada-rolante', texto: 'Escada rolante parada' },
  { tipo: 'banheiro', texto: 'Banheiro fechado' },
  { tipo: 'rampa', texto: 'Rampa ou acesso bloqueado' },
  { tipo: 'piso-tatil', texto: 'Piso tátil danificado' },
  { tipo: 'outro', texto: 'Outro problema' },
]
export const textoTipo = (t: TipoRelato) => TIPOS_RELATO.find((x) => x.tipo === t)?.texto ?? t

export type Relato = {
  id: string
  estacao_id: string
  tipo: TipoRelato
  comentario: string | null
  criado_em: string
  valido_ate: string
  confirmacoes: number
  resolveu: number
}

// Mensagens dos erros que o banco devolve (raise exception '...').
const ERROS: Record<string, string> = {
  longe_da_estacao: `Só dá para avisar ou confirmar estando na estação (até ${RAIO_ESTACAO_M} m dela).`,
  comentario_obrigatorio: 'Em "Outro problema", escreva o que aconteceu.',
  muitos_avisos: 'Você já mandou muitos avisos na última hora. Tente mais tarde.',
  ja_votou: 'Você já respondeu este aviso.',
  proprio_aviso: 'Foi você que avisou: espere outra pessoa confirmar.',
  aviso_encerrado: 'Este aviso já foi encerrado.',
}

/** ID anônimo do aparelho, guardado no navegador. Não identifica a pessoa: só evita voto repetido. */
function idDoAparelho(): string {
  const chave = 'accessmetro:aparelho'
  try {
    let id = localStorage.getItem(chave)
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(chave, id) }
    return id
  } catch {
    return crypto.randomUUID() // navegador sem armazenamento (aba anônima de alguns celulares)
  }
}

/** Quais avisos este aparelho já respondeu, para trocar os botões por "Você respondeu". */
const CHAVE_RESPONDIDOS = 'accessmetro:respondidos'
export function jaRespondi(id: string): boolean {
  try { return (JSON.parse(localStorage.getItem(CHAVE_RESPONDIDOS) ?? '[]') as string[]).includes(id) } catch { return false }
}
function marcarRespondido(id: string) {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_RESPONDIDOS) ?? '[]') as string[]
    localStorage.setItem(CHAVE_RESPONDIDOS, JSON.stringify([...lista, id].slice(-200)))
  } catch { /* sem armazenamento: o banco ainda barra o voto repetido */ }
}

async function rpc<T>(funcao: string, corpo: object): Promise<T> {
  if (!RELATOS_LIGADOS) throw new Error('Avisos indisponíveis agora.')
  const r = await fetch(`${URL_SUPABASE}/rest/v1/rpc/${funcao}`, {
    method: 'POST',
    // A chave vem da variável de ambiente (nunca escrita aqui). É a pública: o banco protege com as funções.
    headers: { 'apikey': CHAVE_PUBLICA!, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
  if (!r.ok) {
    const erro = await r.json().catch(() => null) as { message?: string } | null
    throw new Error(ERROS[erro?.message ?? ''] ?? 'Não deu para falar com o servidor. Tente de novo.')
  }
  const texto = await r.text()
  return (texto ? JSON.parse(texto) : null) as T
}

export function buscarRelatos(estacoes: string[]): Promise<Relato[]> {
  return rpc<Relato[]>('relatos_ativos', { p_estacoes: estacoes })
}

export function criarRelato(estacao: string, tipo: TipoRelato, comentario: string, onde: Posicao): Promise<string> {
  return rpc<string>('criar_relato', {
    p_estacao: estacao, p_tipo: tipo, p_comentario: comentario, p_aparelho: idDoAparelho(), p_lat: onde.lat, p_lon: onde.lon,
  }).then((id) => { marcarRespondido(id); return id })
}

export function votarRelato(relato: string, voto: 'ainda' | 'resolveu', onde: Posicao): Promise<void> {
  return rpc<void>('votar_relato', {
    p_relato: relato, p_voto: voto, p_aparelho: idDoAparelho(), p_lat: onde.lat, p_lon: onde.lon,
  }).then(() => marcarRespondido(relato))
}

/** Pede a localização ao navegador (com mensagem clara se a pessoa negar). */
export function pegarPosicao(): Promise<Posicao> {
  return new Promise((ok, falha) => {
    if (!('geolocation' in navigator)) { falha(new Error('Este navegador não informa a localização.')); return }
    navigator.geolocation.getCurrentPosition(
      (p) => ok({ lat: p.coords.latitude, lon: p.coords.longitude }),
      (e) => falha(new Error(e.code === e.PERMISSION_DENIED
        ? 'Para avisar, libere a localização nas configurações do navegador: é assim que sabemos que você está na estação.'
        : 'Não deu para achar sua localização agora. Tente de novo.')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  })
}

/** "há 12 min", "há 2 h". */
export function haQuanto(iso: string, agora = Date.now()): string {
  const min = Math.max(0, Math.round((agora - new Date(iso).getTime()) / 60000))
  if (min < 1) return 'agora mesmo'
  if (min < 60) return `há ${min} min`
  return `há ${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''}`
}

/** "14:32 de 27/11" (horário de São Paulo, mesmo para quem está com o celular em outro fuso). */
export function horaEData(iso: string): string {
  const d = new Date(iso)
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
  const dia = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' })
  return `${hora} de ${dia}`
}

/**
 * Avisos ativos das estações pedidas, atualizados a cada 30 s enquanto a tela está aberta.
 * 30 s e não "ao vivo" (Realtime): é mais simples, e para elevador parado meio minuto não muda nada.
 */
export function useRelatos(estacoes: string[]) {
  const chave = estacoes.join(',')
  const [lista, setLista] = useState<Relato[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(RELATOS_LIGADOS)

  const recarregar = useCallback(async () => {
    if (!RELATOS_LIGADOS || !chave) return
    try {
      setLista(await buscarRelatos(chave.split(',')))
      setErro(null)
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCarregando(false)
    }
  }, [chave])

  useEffect(() => {
    void recarregar()
    const t = setInterval(() => { if (document.visibilityState === 'visible') void recarregar() }, 30000)
    return () => clearInterval(t)
  }, [recarregar])

  return { lista, erro, carregando, recarregar }
}
