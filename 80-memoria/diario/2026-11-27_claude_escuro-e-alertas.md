# 2026-11-27 · claude · Modo escuro e alertas no mapa

## Pedido
Enzo: aviso de passageiro visível no próprio mapa; e um modo escuro.

## O que fiz (com caminhos completos)
- `40-produto/app/src/components/tema.ts`: tema claro/escuro (segue o celular, botão salva a escolha).
- `40-produto/app/index.html`: script que aplica o tema antes do React (sem piscar).
- `40-produto/app/src/App.tsx`: botão de lua/sol no topo.
- `40-produto/app/src/index.css`: cores por função; bloco "Modo escuro"; alertas na lista e no painel.
- `40-produto/app/src/mapa/MapaSP.tsx`: fundo "Dark" do OpenFreeMap no escuro; camadas de alerta (halo que pulsa e selo "!"); tocar no selo abre a estação.
- `40-produto/app/src/pages/Inicio.tsx`: uma busca de avisos para o mapa todo; lista "Avisos de passageiros agora"; marca nas estações perto de você.
- `40-produto/app/src/data/relatos.ts`: `useRelatos(null)` busca de todas as estações.
- Testado: prints claro e escuro em 390×844 (mapa, estação, linhas), troca e memória do tema ao recarregar, fluxo dos avisos (11 verificações) e gaveta.

## Decisões e erros registrados
- `80-memoria/decisoes/D-012_modo-escuro-e-alertas-no-mapa.md`
