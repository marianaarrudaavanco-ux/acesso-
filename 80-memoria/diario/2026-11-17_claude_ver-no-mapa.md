# 2026-11-17 · claude · Botão "Ver no mapa" na página da estação
## Pedido
Enzo testou no PC e aprovou o mapa. Pediu, na página de cada estação, um jeito de ir direto ao mapa naquela estação para usar a localização e traçar a rota.

## O que fiz (com caminhos completos)
- `40-produto/app/src/pages/Estacao.tsx`: botão principal "Ver no mapa e traçar rota" (vai para `/?estacao=<id>`); "Abrir no Google Maps" virou secundário.
- `40-produto/app/src/pages/Inicio.tsx`: lê `?estacao=` ao abrir e já seleciona a estação; selecionar/fechar atualizam o endereço (dá para compartilhar o link).
- Teste: Tucuruvi → Ver no mapa → painel na estação → rota sem escadas (simulada) → fechar limpa o endereço. Sem rolagem lateral; botões com 63 px de altura.

## Decisões e erros registrados
- Nenhuma decisão nova (cabe em D-008).

## Pendente
- Testar GPS e rota real no celular (link da Vercel da Mariana ou `npx vercel deploy --temporary`).
