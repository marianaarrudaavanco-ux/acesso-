# 2026-11-17 · claude · Repaginada, mapa, guia e conferência das estações
## Pedido
Enzo pediu: repaginar a interface (cara de vibe coding), mapa com ruas e bairros, guia com textos de uso e testes em campo, conferir todas as estações uma por uma e corrigir a turma para 2ADM2.

## O que fiz (com caminhos completos)
- **Conferência das estações:** comparei as 211 estações, nome e ordem, com as tabelas das páginas de cada linha na Wikipédia. As 14 linhas batem. Três diferenças eram estações que ainda não abriram (Chácara do Jockey na Linha 4, Penha na Linha 11, e Barra Funda/Luz/Brás na Linha 13, que são só do Expresso Aeroporto). Corrigi 17 nomes oficiais que o GeoSampa escreve sem complemento ou patrocínio (ex.: Saúde-Ultrafarma). O script de conferência fica em `30-dados/scripts/conferir_estacoes.py`.
- **Operadoras:** Linha 7 TIC Trens; 4, 5 e 17 Motiva; 8 e 9 ViaMobilidade (Motiva); 11, 12 e 13 Trivia Trens (11 e 12 com supervisão da CPTM até 25/11). Fontes em `30-dados/linhas.md`. Errei a da Linha 17 antes: E-001.
- **Turma:** 2CDD01 → 2ADM2 em `AGENTS.md`, `README.md` e no rodapé do site.
- **Mapa:** fundo CARTO Voyager (ruas e bairros) e traçado real das linhas, gerado por `30-dados/scripts/gerar_tracados.py` (Linha 17 recortada só no trecho aberto). Filtro virou caixa de seleção.
- **Repaginada:** `40-produto/app/src/index.css` reescrito; telas em `40-produto/app/src/pages/`; ícones SVG em `40-produto/app/src/components/Icone.tsx`.
- **Guia e testes:** textos com fonte em `40-produto/app/src/data/recursos.ts`; tabela de testes em `40-produto/app/src/data/vistorias.md`, lida por `40-produto/app/src/data/vistorias.ts`. Testei com linhas de exemplo (uma certa, uma mal preenchida, que foi ignorada) e tirei antes do commit.
- **Testes:** build passa; prints em 320, 390 e 1280 px; sem rolagem lateral; alvos de toque com 44 px ou mais (fora links dentro de texto). Os blocos do mapa não carregam no ambiente de teste; os traçados e estações aparecem certos.

## Decisões e erros registrados
- D-006 (proposta): visual de sinalização e mapa com ruas e traçados.
- D-007: situação dos recursos vem de testes em campo.
- E-001: operadora da Linha 17.

## Pendente
- O grupo fazer os primeiros testes em campo e preencher a tabela.
- Vercel (a Mariana importar o repositório).
- Cores oficiais dos trens e da Linha 17.
