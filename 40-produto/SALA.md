# Sala: Produto
**Dono que escreve:** `claude` / `claude-code`; o Enzo revisa e aprova.
**O que mora aqui:** o código do site, em `40-produto/app/`.
**O que NÃO mora aqui:** decisões sobre de onde vêm os dados (`30-dados/`), escopo e telas (`10-projeto/proposta.md`).

## Stack (D-002)
- Vite + React + TypeScript, com React Router
- MapLibre GL com o estilo Liberty do OpenFreeMap para o mapa; rotas a pé pelo Valhalla (D-008)
- Fonte Atkinson Hyperlegible (feita para baixa visão), servida pelo próprio site (`@fontsource`)
- Supabase para os relatos colaborativos (ainda não usado)
- Vercel para o deploy

## Arquivos
| Arquivo | O que é |
|---|---|
| `40-produto/app/src/main.tsx` | Rotas: `/` (mapa), `/linhas`, `/linha/:numero`, `/estacao/:id`, `/guia` |
| `40-produto/app/src/pages/Inicio.tsx` | Tela inicial: mapa, busca, onde estou, painel com estação e rota |
| `40-produto/app/src/mapa/MapaSP.tsx` | O mapa e as nossas camadas (linhas, estações, você, rota) |
| `40-produto/app/src/mapa/rota.ts` | Pede a rota ao Valhalla e decodifica o caminho |
| `40-produto/app/src/mapa/geo.ts` | Distância e estações mais perto |
| `40-produto/app/src/components/useBrilhoVidro.ts` | Brilho do vidro que segue o mouse |
| `40-produto/app/src/components/PaletaPrevia.tsx` | Seletor das 3 paletas, só com `?paletas` no endereço (D-009) |
| `40-produto/app/src/App.tsx` | Topo, menu, rodapé; leva o foco ao conteúdo quando a tela muda |
| `40-produto/app/src/pages/` | Uma tela por arquivo |
| `40-produto/app/src/components/SeloLinha.tsx` | Selo colorido com o número da linha |
| `40-produto/app/src/data/linhas.ts` | Linhas, cores e operadoras (fatos vêm de `30-dados/linhas.md`) |
| `40-produto/app/src/data/estacoes.json` | Estações. **Gerado** por `30-dados/scripts/gerar_estacoes.py`: não editar à mão |
| `40-produto/app/src/data/estacoes.ts` | Tipos e funções de busca das estações |
| `40-produto/app/src/data/recursos.ts` | Recursos de acessibilidade e textos do guia, com fontes |
| `40-produto/app/src/data/tracados.json` | Desenho das linhas. **Gerado** por `30-dados/scripts/gerar_tracados.py` |
| `40-produto/app/src/data/vistorias.md` | Testes em campo, preenchidos pelo grupo (D-007) |
| `40-produto/app/src/data/vistorias.ts` | Lê a tabela de testes e acha o mais recente por recurso |
| `40-produto/app/src/components/Icone.tsx` | Ícones SVG dos recursos |
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
Quem importa é a dona do repositório (a Vercel só faz deploy automático de repositório da própria conta):
1. vercel.com → Continue with GitHub (conta `marianaarrudaavanco-ux`).
2. vercel.com/new → Import no `acesso-` (se não aparecer: Adjust GitHub App Permissions).
3. Root Directory: Edit → `40-produto/app`. Framework Preset: Vite.
4. Deploy.

No plano grátis (Hobby) não dá para convidar o grupo para o projeto: isso é só no Pro (E-002).
Não atrapalha: como o repositório é público, commits de qualquer pessoa do grupo também publicam
(https://vercel.com/docs/deployments/troubleshoot-project-collaboration). Para ver erros de build,
quem tem a conta (Mariana) olha o painel da Vercel ou manda o print.

## Regras desta sala
- Visual (D-006 e D-009): conteúdo no estilo de sinalização (fios entre itens, ícones SVG, sem emoji nem cartão); controles arredondados; vidro só sobre o mapa.
- Toda animação respeita "reduzir movimento" (estado final direto).
- `npm run build` passa antes de qualquer commit de código.
- Toda tela funciona com teclado e leitor de tela; contraste mínimo WCAG AA; alvo de toque com 48 px de altura.
- Onde não há dado com fonte, a tela diz "não verificado" ou "em breve". Nunca dado de exemplo apresentado como real.
- Nada de chave no código: use `import.meta.env` e `.env.local` (fora do Git).
