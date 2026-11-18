# 2026-11-17 · claude · Responsividade
## Pedido
Enzo pediu para melhorar a responsividade.

## O que fiz (com caminhos completos)
- Varredura em 10 tamanhos (320×568, 360×740, 390×844, 430×932, 568×320, 844×390, 768×1024, 1024×768, 1366×768, 1920×1080) e 6 telas, medindo topo, área livre do mapa, sobreposições e rolagem.
- Problemas achados: topo em 2 linhas no celular (108 px); página do mapa rolando em tela baixa (altura mínima de 460 px); botões de zoom embaixo do painel; painel esticado no tablet; celular deitado quase sem mapa.
- Correções em `40-produto/app/src/index.css` (bloco "Responsividade") e `40-produto/app/src/App.tsx` (nome da marca num span para poder esconder em 320 px): topo numa linha (54 px); mapa sem altura mínima; botões em fila abaixo da busca no celular; painel com no máximo 46% em tela baixa e 36rem de largura no tablet; painel na lateral no celular deitado.
- Depois: nenhum tamanho com rolagem lateral, rolagem na tela do mapa ou sobreposição. Área livre do mapa em 320×568 foi de 105 px para 183 px.

## Pendente
- Testar em celular de verdade (barra do navegador muda a altura útil).
