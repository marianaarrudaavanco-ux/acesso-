# Sala: Produto
**Dono que escreve:** `claude` / `claude-code`; o Enzo revisa e aprova.
**O que mora aqui:** o código do site, em `40-produto/app/`.
**O que NÃO mora aqui:** decisões sobre de onde vêm os dados (`30-dados/`), escopo e telas (`10-projeto/proposta.md`).

## Stack (D-002)
- Vite + React + TypeScript
- Leaflet (`react-leaflet`) + OpenStreetMap para o mapa
- Supabase para os relatos colaborativos
- Vercel para o deploy, incluindo a função `/api/status`

## Arquivos
| Arquivo | O que é |
|---|---|
| `40-produto/app/` | Projeto Vite (ainda não criado) |

## Como rodar
`[a preencher quando o projeto for criado]`

## Deploy
- Vercel, Root Directory = `40-produto/app`.

## Regras desta sala
- `npm run build` passa antes de qualquer commit de código.
- Toda tela funciona com teclado e leitor de tela; contraste mínimo WCAG AA.
- Nada de chave no código: use `import.meta.env` e `.env.local` (fora do Git).
