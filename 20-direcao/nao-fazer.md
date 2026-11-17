# Não fazer
> O que ficou de fora de propósito. Antes de propor algo daqui, leia a decisão citada.

- **Não inventar status de elevador ou lotação "em tempo real".** Não existe fonte pública disso; o site usa relatos colaborativos e lotação estimada, rotulada como estimativa. (D-003)
- **Não criar motor de rotas próprio.** "Como chegar" abre o app de mapas do celular. (`90-arquivo/fontes/2026-11-11_grupo_documentacao-original.md`, seção 4)
- **Não exigir login para reportar problema.** Quem está na estação precisa avisar rápido; o controle de spam é por ID anônimo do aparelho. (D-003)
- **Não chamar o site oficial direto do navegador.** O status das linhas passa por uma função na Vercel (`/api/status`), por causa de CORS. (D-003)
- **Não usar API paga de mapas.** Leaflet + OpenStreetMap. (`90-arquivo/fontes/2026-11-11_grupo_documentacao-original.md`, seção 4)
