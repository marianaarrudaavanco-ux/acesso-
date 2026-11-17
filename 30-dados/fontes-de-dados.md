# Fontes de dados
> Pesquisa de 2026-11-11 (diário `80-memoria/diario/2026-11-17_claude_montagem-do-palacio.md`). Decisão: D-003.

| Dado | Tipo | Fonte | Como entra no site |
|---|---|---|---|
| Linhas, estações, coordenadas | Real, fixo | GTFS público (inclui linhas CPTM: https://ipeagit.github.io/intro_access_book/4_dados_gtfs.en.html) e OpenStreetMap | Arquivo de dados dentro do app |
| Recursos de acessibilidade por estação (elevador, banheiro, rampa, piso tátil) | Real, fixo | Páginas das operadoras e OpenStreetMap `[a confirmar qual fonte cobre melhor]` | Arquivo de dados dentro do app |
| Status das linhas (Normal, Velocidade Reduzida, Paralisada) | Real, ao vivo | Sites oficiais; não há API oficial. Projeto de referência que já lê essas páginas: https://github.com/caian-org/tpsp | Função na Vercel `/api/status` lê a página e devolve JSON |
| Elevador/banheiro com problema agora | Colaborativo | Relatos dos usuários | Supabase (`30-dados/relatos-colaborativos.md`) |
| Lotação | Estimado | Horário de pico vs. fora de pico `[a confirmar critério]` | Calculado no app, rotulado "estimativa" |

## O que não existe publicamente
- Status de elevador em tempo real: o Metrô comunica falhas por nota à imprensa, não por feed de dados.
- Lotação medida em tempo real.

## A confirmar
- [ ] Qual página oficial usar para o status (Metrô, CPTM e concessionárias têm páginas diferentes; ver como o `tpsp` faz).
- [ ] Fonte mais completa para os recursos de acessibilidade de cada estação.
