# D-008: Mapa vira a tela inicial, estilo Google Maps, com rota a pé e sem escadas
- **Data:** 2026-11-17 · **Quem decidiu:** Enzo · **Status:** Valendo
## Contexto
O Enzo quer usar o site como um Moovit ou Waze: ver as ruas e bairros e ir a pé até a estação. O mapa de D-006 (Leaflet + CARTO) mostrava ruas, mas não tinha "onde estou" nem rota.
## Decisão
- O mapa é a tela inicial (`/`); a lista de linhas foi para `/linhas`; `/mapa` redireciona para `/`.
- Mapa vetorial com MapLibre GL e o estilo "Liberty" do OpenFreeMap (ruas, bairros, prédios). Linhas, estações, você e a rota são camadas nossas por cima (`40-produto/app/src/mapa/MapaSP.tsx`).
- Se o OpenFreeMap não responder, o mapa troca para um fundo simples e as linhas continuam aparecendo.
- "Onde estou" usa o GPS do navegador e lista as 5 estações mais perto (em linha reta).
- Rota a pé e "rota sem escadas" calculadas pelo Valhalla (servidor público do FOSSGIS), desenhadas no mapa com passo a passo em português (`40-produto/app/src/mapa/rota.ts`). Sem escadas = tipo wheelchair do Valhalla. Se falhar, o painel oferece abrir no Google Maps.
## Por quê (e o que foi descartado)
- OpenFreeMap: sem limite de visualizações, sem cadastro, sem chave, uso comercial liberado (https://openfreemap.org/). Descartado Google Maps (chave e cartão).
- Valhalla tem rota para cadeira de rodas, que o Google Maps não tem a pé. Descartado OSRM público (só carro).
- Regra do servidor do Valhalla: no máximo 1 pedido por segundo e proibido para site de tráfego alto (https://fossgis.de/arbeitsgruppen/osm-server/nutzungsbedingungen). Para o protótipo serve: a rota só é pedida quando a pessoa toca no botão.
## Consequências
- Se o site ganhar muito acesso, precisa de servidor de rotas próprio ou pago (ex.: Stadia Maps).
- A rota sem escadas depende do que está mapeado no OpenStreetMap: o site avisa para conferir a calçada.
- O pacote do mapa pesa ~310 KB comprimido; só baixa na tela do mapa.
- Substitui a parte do mapa de D-006.
## Fonte
Pedido do Enzo em 2026-11-17; diário `80-memoria/diario/2026-11-17_claude_mapa-e-vidro.md`.
