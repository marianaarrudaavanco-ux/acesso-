# 2026-11-17 · claude · Mapa como tela inicial e repaginada com a skill front-design-supremo
## Pedido
Enzo quer o mapa como no Google Maps (ruas, bairros) e usar o site como Moovit/Waze, indo a pé até a estação. Pediu também nova repaginada usando a skill front-design-supremo (com vidro líquido). Escolheu: mapa como tela inicial; ver 2 ou 3 paletas.

## O que fiz (com caminhos completos)
- **Mapa novo (D-008):** MapLibre + OpenFreeMap em `40-produto/app/src/mapa/MapaSP.tsx`; tela inicial em `40-produto/app/src/pages/Inicio.tsx`; rota em `40-produto/app/src/mapa/rota.ts` (decodificador conferido com o exemplo oficial do formato); distâncias em `40-produto/app/src/mapa/geo.ts`. Leaflet removido.
- **Vidro e paletas (D-009):** CSS do vidro e das 3 paletas em `40-produto/app/src/index.css`; brilho em `40-produto/app/src/components/useBrilhoVidro.ts`; seletor em `40-produto/app/src/components/PaletaPrevia.tsx`.
- **Animação da linha:** faixa desce e estações acendem (`40-produto/app/src/pages/Linha.tsx` + CSS).
- **Testes** (o OpenFreeMap, o Valhalla e o GPS são simulados só no teste, porque a rede daqui bloqueia): fluxo completo localização → estações perto → estação → rota sem escadas (confere que o pedido sai com type wheelchair) → passo a passo; prints em 320, 375, 768, 1024 e 1440 px; sem rolagem lateral; alvos de toque ≥ 44 px; contraste AA nas 3 paletas; animação no meio e no fim; "reduzir movimento" mostra o estado final.

## Problemas achados nos testes e corrigidos
- Mapa com altura 0: o CSS do MapLibre (`.maplibregl-map { position: relative }`) vencia o meu `position: absolute`.
- Rota escondida atrás do painel: o padding do `flyTo` ficava gravado e somava com o do `fitBounds` ("Map cannot fit"). Agora zera antes.
- Rota azul se confundia com a Linha 1: virou pontilhada.
- "Reduzir movimento" não parava a faixa: `*` não pega `::before`.
- Resultados da busca atrás do painel; "1000 m" em vez de "1,0 km".

## Decisões e erros registrados
- D-008 (valendo), D-009 (proposta). D-006: parte do mapa substituída por D-008.

## Pendente
- O grupo escolher a paleta (abrir o site com `?paletas`).
- Testar no celular de verdade: GPS, rota real do Valhalla e fundo do OpenFreeMap (não dá para testar daqui).
- Vercel (Mariana).
