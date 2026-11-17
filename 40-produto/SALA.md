# Sala: Produto
**Dono que escreve:** `claude` / `claude-code`; o Enzo revisa e aprova.
**O que mora aqui:** o código do site, em `40-produto/app/`.
**O que NÃO mora aqui:** decisões sobre de onde vêm os dados (`30-dados/`), escopo e telas (`10-projeto/proposta.md`).

## Stack (D-002)
- Vite + React + TypeScript, com React Router
- Leaflet (`react-leaflet`) + OpenStreetMap para o mapa
- Fonte Atkinson Hyperlegible (feita para baixa visão), servida pelo próprio site (`@fontsource`)
- Supabase para os relatos colaborativos (ainda não usado)
- Vercel para o deploy

## Arquivos
| Arquivo | O que é |
|---|---|
| `40-produto/app/src/main.tsx` | Rotas: `/`, `/linha/:numero`, `/estacao/:id`, `/mapa`, `/guia` |
| `40-produto/app/src/App.tsx` | Topo, menu, rodapé; leva o foco ao conteúdo quando a tela muda |
| `40-produto/app/src/pages/` | Uma tela por arquivo |
| `40-produto/app/src/components/SeloLinha.tsx` | Selo colorido com o número da linha |
| `40-produto/app/src/data/linhas.ts` | Linhas, cores e operadoras (fatos vêm de `30-dados/linhas.md`) |
| `40-produto/app/src/data/estacoes.json` | Estações. **Gerado** por `30-dados/scripts/gerar_estacoes.py`: não editar à mão |
| `40-produto/app/src/data/estacoes.ts` | Tipos e funções de busca das estações |
| `40-produto/app/src/data/recursos.ts` | Lista de recursos de acessibilidade (elevador, banheiro...) |
| `40-produto/app/src/index.css` | Todo o visual; cores em variáveis no topo |
| `40-produto/app/vercel.json` | Faz as rotas funcionarem ao recarregar a página na Vercel |

## Como rodar
```
cd 40-produto/app
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # tem que passar antes de qualquer commit
```

## Deploy
- Vercel, Root Directory = `40-produto/app`, preset Vite.

## Regras desta sala
- `npm run build` passa antes de qualquer commit de código.
- Toda tela funciona com teclado e leitor de tela; contraste mínimo WCAG AA; alvo de toque com 48 px de altura.
- Onde não há dado com fonte, a tela diz "não verificado" ou "em breve". Nunca dado de exemplo apresentado como real.
- Nada de chave no código: use `import.meta.env` e `.env.local` (fora do Git).
