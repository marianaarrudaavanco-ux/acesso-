# Proposta do AccessMetro SP
> Fonte: `90-arquivo/fontes/2026-11-11_grupo_documentacao-original.md`, atualizada pelas decisões D-002 a D-004.

## O problema
Quem depende de elevador, rampa ou banheiro adaptado é pego de surpresa no transporte sobre trilhos de SP: elevador parado, banheiro fechado, linha com atraso sem aviso.

## O que o site entrega
- **Status das linhas** (Normal, Velocidade Reduzida, Paralisada...), vindo das fontes oficiais.
- **Recursos de acessibilidade de cada estação**: elevador, banheiro acessível, rampa/acesso PCD, piso tátil, avisos sonoros/Braille.
- **Relatos colaborativos estilo Waze**: o usuário avisa "elevador parado" e os outros confirmam ou dizem que já resolveu.
- **Lotação estimada** pelo horário, sempre rotulada como estimativa.
- **Mapa** com todas as estações e **"Como chegar (a pé)"**, que abre o app de mapas do celular.

Cobertura: todas as linhas de metrô e trem de São Paulo (D-004). Lista em `30-dados/linhas.md`.

## Para quem
Pessoas com deficiência física, visual ou com mobilidade reduzida, e quem as acompanha.

## Telas
| # | Tela | O que mostra |
|---|---|---|
| 1 | Linhas (início) | Todas as linhas com status, lotação estimada e alertas ativos |
| 2 | Detalhe da linha | Estações da linha com os recursos e relatos de cada uma |
| 3 | Estação | Recursos, relatos ativos, botão "Reportar problema" e "Como chegar" |
| 4 | Mapa | Estações no mapa, cor por situação, filtro por linha |
| 5 | Guia de acessibilidade | Legenda dos ícones e termos |
| 6 | Premium | `[a confirmar]`: estava na proposta original (planos simulados "sem anúncios"); o grupo decide se mantém |
