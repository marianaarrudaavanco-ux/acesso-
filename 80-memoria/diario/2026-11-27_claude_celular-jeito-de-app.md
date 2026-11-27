# 2026-11-27 · claude · Celular com jeito de app

## Pedido
Enzo: o site no celular está ruim, tudo muito grande; melhorar a UI e deixar mais interativo.

## O que fiz (com caminhos completos)
- `40-produto/app/src/App.tsx`: ícones no menu (só aparecem no celular, onde o menu vira a barra de baixo).
- `40-produto/app/src/pages/Inicio.tsx`: gaveta do mapa com três alturas e arrasto pela alça; filtro de linhas em chips; texto do painel mais curto; vibração leve ao escolher estação.
- `40-produto/app/src/index.css`: bloco "Celular: jeito de app" (barra de baixo, 16 px, espaçamentos menores, botões de largura total na estação, retorno ao toque) e celular deitado usando o layout de celular.
- `40-produto/app/index.html`: `viewport-fit=cover`, para a barra respeitar a área do iPhone sem botão.
- Testado com prints em 320×568, 390×844, 844×390 e 1366×768, e arrasto da gaveta simulado (cheio, fechado, toque volta para metade).

## Decisões e erros registrados
- `80-memoria/decisoes/D-010_celular-jeito-de-app.md`

## Pendente
- Testar no celular de verdade (arrasto com o dedo, iPhone e Android).
