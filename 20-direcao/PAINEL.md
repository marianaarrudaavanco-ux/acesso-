# Painel
> Onde estamos **agora**. Reescrito, não acumula. Histórico em `80-memoria/diario/INDICE.md`.
> Última atualização: 2026-11-17, por claude.

## Foco da semana
1. Enzo revisar os PRs (repaginada #3 e mapa).
2. Grupo escolher a paleta (site com `?paletas`) e testar o mapa no celular de verdade: GPS, rota e fundo.
3. Grupo fazer os primeiros testes em campo (`40-produto/app/src/data/vistorias.md`).
4. Mariana importar o repositório na Vercel (passo a passo em `40-produto/SALA.md`).

## Frentes
| Frente | Sala | Estado | Próximo passo | Dono |
|---|---|---|---|---|
| Palácio da memória | `00-portaria/` | Montado (v0.1) | Grupo completar nomes e papéis em `00-portaria/agentes.md` | grupo |
| Mapa (tela inicial) | `40-produto/app/src/mapa/` | Pronto (D-008): ruas, onde estou, rota a pé e sem escadas | Teste no celular de verdade | grupo / claude |
| Visual | `40-produto/app/src/index.css` | Vidro sobre o mapa, 3 paletas em prévia (D-009) | Grupo escolher a paleta; tirar o seletor | grupo |
| Estações e linhas | `30-dados/linhas.md` | 211 estações conferidas; operadoras com fonte | Rodar `30-dados/scripts/conferir_estacoes.py` quando abrir estação nova | claude |
| Testes em campo | `40-produto/app/src/data/vistorias.md` | Pronto para receber testes (D-007) | Grupo ir às estações | grupo |
| Status real das linhas | `30-dados/fontes-de-dados.md` | Pesquisado | Escolher página oficial e criar `/api/status` | claude |
| Relatos colaborativos | `30-dados/relatos-colaborativos.md` | Desenhado | Criar tabelas no Supabase | claude / enzo revisa |

## Bloqueios e "a confirmar"
- [ ] Paleta escolhida pelo grupo.
- [ ] Nomes e papéis do grupo em `00-portaria/agentes.md`.
- [ ] Tela Premium fica ou sai? (`10-projeto/proposta.md`)
- [ ] Vercel: a Mariana importa o repositório (Root Directory `40-produto/app`, preset Vite).
- [ ] Cores oficiais dos trens e da Linha 17.
