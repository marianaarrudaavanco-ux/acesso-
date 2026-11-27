# D-011: Relatos colaborativos no ar, só de quem está na estação, com prazo
- **Data:** 2026-11-27 · **Quem decidiu:** Enzo · **Status:** Valendo

## Contexto
Os relatos estilo Waze estavam só desenhados (`30-dados/relatos-colaborativos.md`). O Enzo pediu para colocar no ar,
só para quem estiver na estação, e com prazo para aviso velho não confundir ("a coisa já pode ter voltado ao normal").

## Decisão
- Banco no Supabase (projeto `accessmetro`). O site não toca nas tabelas: chama 3 funções que conferem as regras no servidor.
- Avisar e responder exige estar a até 500 m da estação (localização pedida na hora do toque, conferida no site e no banco).
- Prazo: 3 h depois do aviso ou da última confirmação; teto de 24 h desde o aviso, mesmo com confirmações. Cada aviso mostra data, hora e quando sai do ar.
- Sem login (como em D-003): ID anônimo do aparelho guardado no navegador; um voto por aviso; 5 avisos por hora.
- Chaves: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` como variáveis de ambiente na Vercel e no `.env.local` (regra 8). Sem elas, a seção mostra que os avisos estão desligados.

## Por quê (e o que foi descartado)
- Funções no banco em vez de liberar a tabela com RLS: as regras (distância, prazo, voto único) não dá para garantir só com políticas, e assim o ID do aparelho fica escondido.
- Fetch puro em vez da biblioteca supabase-js: são 3 chamadas; não vale 50 kB a mais no site.
- Atualização a cada 30 s em vez do Realtime: mais simples, e meio minuto não muda nada para quem vai à estação.
- Raio de 500 m e não 100 m: o ponto do GeoSampa é o centro da estação, as saídas ficam longe, e no subsolo a localização erra muito.

## Consequências
- Quem falsifica o GPS consegue avisar de longe. Aceito para protótipo sem login.
- Mudou a lista de estações? Gerar de novo `30-dados/supabase/002_estacoes.sql` e rodar no Supabase.

## Fonte
Pedido do Enzo no chat do Projeto "AcessMetrô" (2026-11-27).
