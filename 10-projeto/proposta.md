# Proposta do AccessMetro SP
> Fonte: `90-arquivo/fontes/2026-11-11_grupo_documentacao-original.md`, atualizada pelas decisões D-002 a D-004.

## O problema
Quem depende de elevador, rampa ou banheiro adaptado é pego de surpresa no transporte sobre trilhos de SP: elevador parado, banheiro fechado, linha com atraso sem aviso.

## O que o site entrega
- **Status das linhas** (Normal, Velocidade Reduzida, Paralisada...), vindo das fontes oficiais.
- **Recursos de acessibilidade de cada estação**: elevador, banheiro acessível, rampa/acesso PCD, piso tátil, avisos sonoros/Braille.
- **Relatos colaborativos estilo Waze**: o usuário avisa "elevador parado" e os outros confirmam ou dizem que já resolveu.
- **Lotação estimada** pelo horário, sempre rotulada como estimativa.
- **Mapa como tela inicial**, com ruas e bairros, "onde estou" e **rota a pé ou sem escadas** desenhada até a estação (D-008).

Cobertura: todas as linhas de metrô e trem de São Paulo (D-004). Lista em `30-dados/linhas.md`.

## Para quem
Pessoas com deficiência física, visual ou com mobilidade reduzida, e quem as acompanha.

## Telas
| # | Tela | O que mostra |
|---|---|---|
| 1 | Mapa (início) | Ruas e bairros com as linhas por cima; busca, onde estou, estações perto, rota a pé e sem escadas (D-008) |
| 2 | Linhas | As 14 linhas, com busca de estação |
| 3 | Detalhe da linha | Estações da linha, em diagrama, com integrações |
| 4 | Estação | Recursos testados pelo grupo, como chegar, integrações |
| 5 | Guia de acessibilidade | Como usar cada recurso e pedir ajuda, com fontes |
| 6 | Premium | `[a confirmar]`: estava na proposta original (planos simulados "sem anúncios"); o grupo decide se mantém |
