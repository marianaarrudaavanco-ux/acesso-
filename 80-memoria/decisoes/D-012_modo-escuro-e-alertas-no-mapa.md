# D-012: Modo escuro e alertas de passageiros no mapa
- **Data:** 2026-11-27 · **Quem decidiu:** Enzo · **Status:** Valendo

## Contexto
O Enzo pediu modo escuro ("muita agonia" no claro) e que o aviso de passageiro apareça no próprio mapa, não só ao tocar na estação.

## Decisão
- **Modo escuro:** sem escolha salva, segue o celular (prefers-color-scheme). O botão de lua/sol no topo troca e salva no navegador. O `40-produto/app/index.html` aplica o tema antes do React, para a tela não piscar branca.
- As cores passaram a ser por função (`--superficie`, `--faixa`, `--sobre-piso`, `--realce`, `--divisor`); o modo escuro só troca essas variáveis, no fim do `40-produto/app/src/index.css`.
- O amarelo do piso tátil não muda no escuro, e o texto sobre ele é sempre escuro (`--sobre-piso`).
- O fundo do mapa vira o estilo "Dark" do OpenFreeMap (grátis, mesmo fornecedor).
- **Alertas no mapa:** estação com aviso ganha halo vermelho que "respira" e um selo com "!" no canto. O painel inicial lista "Avisos de passageiros agora", e a lista de estações perto de você marca quem tem aviso.

## Por quê (e o que foi descartado)
- Seguir o celular por padrão: quem já usa escuro no sistema não precisa achar o botão.
- Cores por função em vez de inverter `--tinta`/`--branco`: o topo e as faixas são escuros nos dois modos, e o texto sobre o amarelo precisa ficar escuro sempre.
- O halo pulsa só quando há aviso e a ~12 quadros por segundo: redesenhar o mapa sem parar gasta bateria. Com "reduzir movimento", fica parado.
- Uma busca só de avisos para o mapa todo (a cada 30 s), e o painel da estação filtra dela: menos chamadas ao banco.

## Consequências
- Cor nova no CSS: usar as variáveis por função, não hex solto, senão quebra no escuro.

## Fonte
Pedido do Enzo no chat do Projeto "AcessMetrô" (2026-11-27).
