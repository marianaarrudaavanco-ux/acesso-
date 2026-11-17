# D-003: Dados reais onde existem, relatos colaborativos onde não existem
- **Data:** 2026-11-11 · **Quem decidiu:** Enzo · **Status:** Valendo
## Contexto
O Enzo quis dados reais em vez de simulados. A pesquisa (`30-dados/fontes-de-dados.md`) mostrou que existe fonte pública para estações e status das linhas, mas não para elevador quebrado agora nem lotação em tempo real.
## Decisão
- Estações, coordenadas e recursos de acessibilidade: dados reais e fixos.
- Status das linhas: real, lido das páginas oficiais por uma função na Vercel (`/api/status`).
- Problemas do momento (elevador, banheiro etc.): relatos colaborativos estilo Waze, guardados no Supabase, sem login (`30-dados/relatos-colaborativos.md`).
- Lotação: estimada pelo horário e rotulada como estimativa no site.
## Por quê (e o que foi descartado)
- Descartado inventar status de elevador: seria dado falso apresentado como real.
- Relato colaborativo é dado real (vem de quem está na estação) e reforça a proposta de autonomia.
- Descartado exigir login para reportar: afasta quem precisa avisar rápido.
## Consequências
- Relatos são o item mais trabalhoso; se o prazo apertar, saem primeiro (`10-projeto/cronograma.md`).
## Fonte
Conversa do Enzo com o `claude` em 2026-11-11; pesquisa em `30-dados/fontes-de-dados.md`.
