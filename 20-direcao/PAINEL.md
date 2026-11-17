# Painel
> Onde estamos **agora**. Reescrito, não acumula. Histórico em `80-memoria/diario/INDICE.md`.
> Última atualização: 2026-11-17, por claude.

## Foco da semana
1. Enzo revisar e aprovar os PRs do palácio e do protótipo.
2. Publicar o protótipo na Vercel.
3. Levantar os recursos de acessibilidade das estações (hoje aparecem como "Não verificado").

## Frentes
| Frente | Sala | Estado | Próximo passo | Dono |
|---|---|---|---|---|
| Palácio da memória | `00-portaria/` | Montado (v0.1) | Grupo completar nomes e papéis em `00-portaria/agentes.md` | grupo |
| Protótipo do app | `40-produto/app/` | 5 telas prontas, build passando | Revisão do Enzo; deploy na Vercel | claude / enzo revisa |
| Estações e linhas | `30-dados/linhas.md` | 211 estações reais (GeoSampa) | Confirmar operadoras das linhas 7, 11, 12 e 13 | claude |
| Recursos de acessibilidade | `30-dados/fontes-de-dados.md` | Não levantado | Achar fonte por estação (operadoras, OpenStreetMap) | claude |
| Status real das linhas | `30-dados/fontes-de-dados.md` | Pesquisado | Escolher página oficial e criar `/api/status` | claude |
| Relatos colaborativos | `30-dados/relatos-colaborativos.md` | Desenhado | Criar tabelas no Supabase | claude / enzo revisa |

## Bloqueios e "a confirmar"
- [ ] Nomes e papéis do grupo em `00-portaria/agentes.md`.
- [ ] Tela Premium fica ou sai? (`10-projeto/proposta.md`)
- [ ] Operadora atual das linhas 7, 11, 12 e 13 (`30-dados/linhas.md`).
- [ ] Vercel: trocar Root Directory para `40-produto/app` (preset Vite).
