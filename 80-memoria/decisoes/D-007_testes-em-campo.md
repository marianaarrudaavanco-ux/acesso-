# D-007: Situação dos recursos vem de testes em campo do grupo
- **Data:** 2026-11-17 · **Quem decidiu:** Enzo · **Status:** Valendo
## Contexto
Não há fonte pública atualizada de quais estações têm elevador, banheiro, rampa etc. e se funcionam (`30-dados/fontes-de-dados.md`). O Enzo pediu textos de uso no guia e testes reais nas estações.
## Decisão
- O grupo testa os recursos nas estações e registra numa tabela em `40-produto/app/src/data/vistorias.md`, editada pelo próprio site do GitHub.
- O site lê a tabela (`40-produto/app/src/data/vistorias.ts`) e mostra na estação o teste mais recente de cada recurso: funciona, não funciona ou não tem, com data e quem testou. Sem teste: "Não testado".
- Linha mal preenchida é ignorada (com aviso no console), não quebra o site.
- O guia (`40-produto/app/src/pages/Guia.tsx`) explica cada recurso e como pedir ajuda; instrução prática só com fonte (`40-produto/app/src/data/recursos.ts`).
## Por quê (e o que foi descartado)
- Tabela em markdown: o grupo preenche sem instalar nada e sem quebrar sintaxe. Descartado JSON (uma vírgula errada quebra o build) e formulário com banco (mais trabalho; fica para os relatos colaborativos).
- A tabela mora dentro de `40-produto/app/` porque a Vercel publica só essa pasta.
## Consequências
- Cada teste vale para o dia em que foi feito: o site mostra a data para a pessoa julgar.
## Fonte
Pedido do Enzo em 2026-11-17.
