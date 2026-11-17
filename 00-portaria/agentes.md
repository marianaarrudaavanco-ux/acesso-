# Quem é quem
Cada sala tem um dono que escreve; os outros leem e sugerem.

## Pessoas
| Quem | Decide | Aprova antes de valer |
|---|---|---|
| Mariana | Dona do repositório; conteúdo e proposta do projeto `[a confirmar]` | Mudanças em `10-projeto/` `[a confirmar]` |
| Enzo | Código e arquitetura do site; revisa e testa o que o Claude escreve | Merge de código em `40-produto/app/` |
| `[a confirmar]` | Demais integrantes do grupo e seus papéis | `[a confirmar]` |

## IAs
| Agente | Para que usamos | Pode escrever em | Não faz |
|---|---|---|---|
| `claude` (Claude app, Projeto "AcessMetrô") | Planejar, pesquisar fontes, escrever código e documentação | Todas as alas, exceto `90-arquivo/fontes/` (só acrescenta, nunca edita) | Não decide escopo sozinho; não faz deploy sem o Enzo saber |
| `claude-code` | Implementar e testar o código | `40-produto/`, `30-dados/`, `80-memoria/` | Não muda `10-projeto/` sem pedido do grupo |

Só Claude (app e Code) trabalha neste projeto. Se outra IA entrar, acrescente uma linha aqui e registre uma decisão.

## Como pedir uma tarefa a um agente
Objetivo · Sala (onde trabalhar e salvar) · Formato da entrega · Fontes · Limites · Prova de que ficou certo.
