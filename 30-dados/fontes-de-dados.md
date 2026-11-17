# Fontes de dados
> Decisões: D-003 (estratégia) e D-005 (estações do GeoSampa).

| Dado | Tipo | Fonte | Como entra no site | Estado |
|---|---|---|---|---|
| Linhas, estações, coordenadas, ordem, integrações | Real, fixo | GeoSampa (`90-arquivo/fontes/2026-04-10_geosampa_estacoes/`) | `30-dados/scripts/gerar_estacoes.py` gera `40-produto/app/src/data/estacoes.json` | Pronto (211 estações, 14 linhas) |
| Recursos de acessibilidade por estação (elevador, banheiro, rampa, piso tátil) | Real, testado | Testes em campo do grupo (D-007) | `40-produto/app/src/data/vistorias.md` | Pronto; nenhum teste ainda, o site mostra "Não testado" |
| Traçado das linhas | Real, fixo | GeoSampa | `30-dados/scripts/gerar_tracados.py` gera `40-produto/app/src/data/tracados.json` | Pronto |
| Status das linhas (Normal, Velocidade Reduzida, Paralisada) | Real, ao vivo | Sites oficiais; não há API oficial. Projeto de referência que já lê essas páginas: https://github.com/caian-org/tpsp | Função na Vercel `/api/status` lê a página e devolve JSON | Não começado |
| Elevador/banheiro com problema agora | Colaborativo | Relatos dos usuários | Supabase (`30-dados/relatos-colaborativos.md`) | Não começado |
| Lotação | Estimado | Horário de pico vs. fora de pico `[a confirmar critério]` | Calculado no app, rotulado "estimativa" | Não começado |

## Como o script trata a base do GeoSampa
- Converte as coordenadas de UTM (SIRGAS 2000 / 23S) para latitude/longitude.
- Corrige: Vila Mariana duplicada na Linha 1; inclui Jardim Colonial (Linha 15) e as 8 estações da Linha 17, que a base ainda lista como projetadas.
- Ordena as estações pelo caminho mais curto a partir de um terminal; a Linha 17 (em Y) tem ordem fixa.
- Integração = estação de outra linha a menos de 450 m.

## O que não existe publicamente
- Status de elevador em tempo real: o Metrô comunica falhas por nota à imprensa, não por feed de dados.
- Lotação medida em tempo real.

## A confirmar
- [ ] Qual página oficial usar para o status (Metrô, CPTM e concessionárias têm páginas diferentes; ver como o `tpsp` faz).
- [x] Recursos de acessibilidade: testes em campo do grupo (D-007).
