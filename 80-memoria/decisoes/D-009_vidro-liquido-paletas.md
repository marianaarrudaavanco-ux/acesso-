# D-009: Vidro líquido sobre o mapa, controles arredondados e 3 paletas em prévia
- **Data:** 2026-11-17 · **Quem decidiu:** Enzo (pediu usar a skill front-design-supremo), claude (proposta) · **Status:** Proposta
## Contexto
O Enzo pediu nova repaginada usando a skill front-design-supremo, que inclui o vidro líquido para web.
## Decisão
- Sobre o mapa, a interface flutua em vidro líquido (desfoque baixo, borda com reflexo, brilho que segue o mouse só em computador e sem "reduzir movimento"): busca, botões e painel.
- Coerência no site todo: controles (botões, busca) arredondados; conteúdo (listas, diagrama, placa da estação) segue no estilo de sinalização de D-006.
- Movimento com motivo: a rota se desenha do ponto azul até a estação; na página da linha, a faixa desce e cada estação acende quando ela chega. Com "reduzir movimento", tudo aparece pronto.
- Três paletas para o grupo escolher, só na prévia (endereço com `?paletas`): Piso tátil (preto e amarelo), Placa (azul-marinho e ciano), Sinal (grafite e laranja). Todas passam contraste AA (mínimo 5,4:1).
## Por quê (e o que foi descartado)
- Vidro só onde há algo atrás para ver (o mapa); nas páginas de texto ele seria enfeite.
- Paleta é decisão de marca: o grupo escolhe. Na "Placa", o selo da Linha 1 quase some no cabeçalho azul-marinho.
## Consequências
- Depois da escolha: a paleta vencedora vira o `:root` em `40-produto/app/src/index.css` e `40-produto/app/src/components/PaletaPrevia.tsx` sai.
## Fonte
Pedido do Enzo em 2026-11-17.
