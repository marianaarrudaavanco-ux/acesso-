# D-010: No celular, o site tem jeito de app
- **Data:** 2026-11-27 · **Quem decidiu:** Enzo · **Status:** Valendo

## Contexto
Depois do deploy na Vercel, o Enzo testou no celular: tudo grande demais e pouco interativo.
O texto base era 18 px em qualquer tela e o menu ficava no topo, longe do polegar.

## Decisão
Em telas até 52rem (e no celular deitado):
- O menu vira uma barra fixa embaixo, com ícone e nome (Mapa, Linhas, Guia).
- O texto base cai para 16 px (padrão dos celulares; o zoom do sistema continua valendo). No computador segue 18 px.
- O painel do mapa vira uma gaveta encostada embaixo, com três alturas (só a alça, metade, quase tudo), que se arrasta pela alça. Tocar na alça e o teclado continuam abrindo e fechando.
- O filtro de linhas vira uma fila de chips com a cor de cada linha (no lugar da lista suspensa), também no computador.
- Botões "afundam" ao toque e o celular vibra de leve ao escolher uma estação.

## Por quê (e o que foi descartado)
- Barra embaixo: é onde o polegar alcança, e é o padrão que as pessoas já conhecem dos apps.
- 16 px e não 14: abaixo de 16 o iPhone dá zoom sozinho ao tocar num campo, e o público tem baixa visão.
- Descartado esconder o topo no mapa (ganharia espaço, mas some a marca na apresentação).
- Descartado tirar os botões de zoom no celular: nem todo mundo consegue fazer o gesto de pinça.

## Consequências
- Alvos de toque seguem com 44 px ou mais.
- O link "Ver lista de linhas" saiu do painel: a barra de baixo já leva às Linhas.

## Fonte
Pedido do Enzo no chat do Projeto "AcessMetrô" (2026-11-27).
