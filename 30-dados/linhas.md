# Linhas de São Paulo
> Todas entram no site (D-004). Atualizado em 2026-11-17.
> No código: `40-produto/app/src/data/linhas.ts` (mudou aqui, mude lá).
> GeoSampa = arquivos em `90-arquivo/fontes/2026-04-10_geosampa_estacoes/` (dados de abril de 2026).
> Lista de estações conferida linha por linha (nome e ordem) com `30-dados/scripts/conferir_estacoes.py`: 14 de 14 batem.

## Metrô
| Linha | Nome | Operadora | Estações | Observação | Fonte da operadora |
|---|---|---|---|---|---|
| 1 | Azul | Metrô | 23 | | https://en.wikipedia.org/wiki/Line_1_(São_Paulo_Metro) |
| 2 | Verde | Metrô | 14 | Expansão em obras (Vila Prudente → Penha → Dutra) | https://transparencia.metrosp.com.br/node/5756/download |
| 3 | Vermelha | Metrô | 18 | | idem |
| 4 | Amarela | Motiva Linha 4 (antiga ViaQuatro) | 11 | Chácara do Jockey e Taboão da Serra em obras, previsão 2028 (https://www.gazetasp.com.br/cotidiano/metro-saiba-como-estao-as-obras-e-quando-sera-inaugurada-a-estacao/1146962) | https://en.wikipedia.org/wiki/Line_4_(São_Paulo_Metro) |
| 5 | Lilás | Motiva Linhas 5 e 17 (antiga ViaMobilidade) | 17 | | https://en.wikipedia.org/wiki/Line_5_(São_Paulo_Metro) |
| 15 | Prata | Metrô | 11 | Monotrilho. Jardim Colonial veio da camada de projetadas do GeoSampa | https://transparencia.metrosp.com.br/node/5756/download |
| 17 | Ouro | Motiva Linhas 5 e 17 (antiga ViaMobilidade) | 8 | Monotrilho em Y. Operação transitória das 6h às 22h, de segunda a sábado (https://diariodotransporte.com.br/2026/09/29/monotrilho-da-linha-17-ouro-passa-a-funcionar-das-6h-as-22h-a-partir-desta-quarta-feira-30/amp/) | https://en.wikipedia.org/wiki/Line_5_(São_Paulo_Metro) (ver E-001) |

## Trens metropolitanos
| Linha | Nome | Operadora | Estações | Observação | Fonte da operadora |
|---|---|---|---|---|---|
| 7 | Rubi | TIC Trens | 17 | | https://transparencia.metrosp.com.br/node/5756/download ; https://en.wikipedia.org/wiki/Line_7_(CPTM) |
| 8 | Diamante | ViaMobilidade (Motiva) | 23 | | https://en.wikipedia.org/wiki/Line_8_(CPTM) |
| 9 | Esmeralda | ViaMobilidade (Motiva) | 21 | | https://en.wikipedia.org/wiki/Line_9_(CPTM) |
| 10 | Turquesa | CPTM | 15 | | GeoSampa; https://en.wikipedia.org/wiki/Line_10_(CPTM) |
| 11 | Coral | Trivia Trens | 17 | Em transição: supervisão da CPTM até 25/11/2026, operação integral prevista para 26/11. Estação Penha em obras | https://www.correiodamanha.com.br/nacional/sao-paulo/estado-de-sao-paulo/2026/10/330185-trivia-trens-reassume-linhas-sob-supervisao-da-cptm.html |
| 12 | Safira | Trivia Trens | 13 | Mesma transição da linha 11 | idem |
| 13 | Jade | Trivia Trens | 3 | Trivia reassumiu integralmente em 26/10/2026. Barra Funda, Luz e Brás só pelo Expresso Aeroporto | idem; https://diariodotransporte.com.br/2026/07/21/concessao-da-trivia-trens-preve-ampliacao-das-linhas-11-12-e-13-novas-estacoes-e-r-143-bilhoes-em-investimentos/ |

## Nomes oficiais
O GeoSampa escreve vários nomes sem complemento ou patrocínio (ex.: "Saúde" em vez de "Saúde-Ultrafarma"). O script `30-dados/scripts/gerar_estacoes.py` troca pelos nomes oficiais (tabela `NOMES`).

## Cores
- Metrô (1, 2, 3, 4, 5, 15): oficiais, do pacote https://github.com/viniciusoike/metrosp.
- Linha 17 e trens: aproximadas `[a confirmar]`.
