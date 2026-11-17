# 2026-11-17 · claude · Protótipo do app
## Pedido
Enzo pediu para começar pelo menos o protótipo do app.

## O que fiz (com caminhos completos)
- **Dados reais das estações:** achei as camadas do GeoSampa no repositório público `viniciusoike/metrosp` e guardei os originais em `90-arquivo/fontes/2026-04-10_geosampa_estacoes/`. Escrevi `30-dados/scripts/gerar_estacoes.py`, que gera `40-produto/app/src/data/estacoes.json` (211 estações, 14 linhas, com ordem e integrações). Conferi a ordem de todas as linhas à mão na saída do script.
- **Correções da base, com fonte:** Vila Mariana duplicada; Jardim Colonial e Linha 17 ainda como projetadas; integração do Brás (Linha 3) a 438 m da CPTM, por isso o limite de 450 m (as duas Lapas ficam a 546 m e continuam separadas).
- **App:** projeto Vite + React + TypeScript em `40-produto/app/`, com 5 telas: início (busca + linhas), linha (diagrama), estação, mapa (Leaflet) e guia. Detalhes em `40-produto/SALA.md`.
- **Visual:** faixa do piso tátil no topo, diagrama de linha como nas placas, fonte Atkinson Hyperlegible, foco de teclado com halo amarelo.
- **Testes:** `npm run build` passa; prints em 320, 375 e 1024 px; sem rolagem lateral; nenhum botão abaixo de 44 px (só links dentro de texto); busca e foco de teclado conferidos. Os blocos do OpenStreetMap não carregam no ambiente de teste (rede bloqueada); as estações aparecem no lugar certo.
- Atualizei `30-dados/linhas.md` (operadoras das linhas 8, 9 e 10 confirmadas pelo GeoSampa) e `30-dados/fontes-de-dados.md`.

## Decisões e erros registrados
- D-005 (proposta): estações do GeoSampa geradas por script; "Como chegar" abre o Google Maps.

## Pendente
- Recursos de acessibilidade de cada estação: o site mostra "Não verificado" até termos fonte.
- Status ao vivo das linhas (`/api/status`) e relatos colaborativos.
- Cores oficiais dos trens e da Linha 17.
- Configurar a Vercel com Root Directory `40-produto/app`.
