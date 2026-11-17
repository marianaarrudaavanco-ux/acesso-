# Sala: Dados
**Dono que escreve:** `claude`; o Enzo revisa.
**O que mora aqui:** de onde vem cada dado do site, a lista de linhas e o desenho dos relatos colaborativos.
**O que NÃO mora aqui:** o código que lê esses dados (`40-produto/app/`), chaves e senhas (nunca entram no repo).

## Arquivos
| Arquivo | O que é |
|---|---|
| `30-dados/fontes-de-dados.md` | Cada dado do site e de onde ele vem |
| `30-dados/linhas.md` | Todas as linhas de SP com operadora e fonte |
| `30-dados/relatos-colaborativos.md` | Regras e tabelas dos relatos estilo Waze |
| `30-dados/scripts/gerar_estacoes.py` | Lê o GeoSampa e gera `40-produto/app/src/data/estacoes.json` |

## Regras desta sala
- Todo dado tem fonte (link ou arquivo em `90-arquivo/fontes/`) ou `[a confirmar]`.
- Dado estimado é marcado como estimado aqui e no site.
- Quando os dados de estações virarem arquivo de código (JSON/TS), ele mora em `40-produto/app/` e esta sala aponta para ele.
