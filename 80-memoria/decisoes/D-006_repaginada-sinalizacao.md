# D-006: Visual de sinalização do metrô e mapa com ruas e traçados
- **Data:** 2026-11-17 · **Quem decidiu:** Enzo (pediu a repaginada), claude (proposta) · **Status:** Proposta; a parte do mapa foi substituída por D-008
## Contexto
O Enzo achou o primeiro protótipo com "cara de vibe coding" e o mapa sem referência: só bolinhas, sem ruas nem bairros. A paleta ele aprovou.
## Decisão
- Linguagem da sinalização do metrô: faixas retas de ponta a ponta, cantos vivos, sem sombra, listas separadas por fios, ícones em SVG próprios (sem emoji), menu com marcador amarelo em vez de pílula. Placa da estação (faixa escura com o nome) e faixa da linha na cor dela.
- Mantidos: paleta, faixa do piso tátil, fonte Atkinson Hyperlegible, diagrama da linha.
- Mapa: fundo CARTO Voyager (ruas, bairros, parques; dados do OpenStreetMap) e traçado real de cada linha (GeoSampa, gerado por `30-dados/scripts/gerar_tracados.py`). Filtro por linha numa caixa de seleção, que no celular ocupa uma linha só.
## Por quê (e o que foi descartado)
- O site é sobre o metrô: a sinalização dele é uma identidade que o público reconhece, e não a de um modelo genérico.
- CARTO Voyager mostra nome de bairro e rua como o Google Maps, sem chave nem custo para projeto sem fins comerciais. Descartado Google Maps (precisa de chave e cobrança).
- Descartados botões de filtro: 15 botões ocupavam a tela do celular inteira.
## Consequências
- Se o site virar comercial, rever os termos da CARTO.
- Cores dos trens e da Linha 17 seguem aproximadas.
## Fonte
Pedido do Enzo em 2026-11-17; diário `80-memoria/diario/2026-11-17_claude_repaginada.md`.
