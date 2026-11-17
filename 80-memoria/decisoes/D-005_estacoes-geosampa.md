# D-005: Estações vêm do GeoSampa, geradas por script
- **Data:** 2026-11-17 · **Quem decidiu:** claude (proposta), Enzo aprova no PR · **Status:** Proposta
## Contexto
D-003 pede estações e coordenadas reais. Daqui não dá para acessar o site do Metrô, o OpenStreetMap (Overpass) nem o GTFS; dá para baixar do GitHub.
## Decisão
Usar as camadas de estações do GeoSampa (Prefeitura de São Paulo), copiadas do repositório público `viniciusoike/metrosp`, guardadas sem edição em `90-arquivo/fontes/2026-04-10_geosampa_estacoes/`. O JSON do app é gerado por `30-dados/scripts/gerar_estacoes.py`, que registra cada correção com a fonte.
"Como chegar a pé" abre o Google Maps com a estação como destino; o próprio Google Maps usa a localização da pessoa, então o site não pede permissão de GPS.
## Por quê (e o que foi descartado)
- GeoSampa é base oficial e cobre metrô e trem (inclusive cidades da Grande SP).
- Script em vez de JSON à mão: dá para refazer quando a base atualizar e mostra o que foi corrigido.
- Descartado `navigator.geolocation` próprio: pediria permissão e não acrescenta nada, já que o app de mapas faz isso.
## Consequências
- A base é de abril de 2026: estações abertas depois precisam entrar como correção no script, com fonte.
- Ordem das estações é calculada; se alguma ficar fora de ordem, corrigir no script.
## Fonte
`30-dados/fontes-de-dados.md`; diário `80-memoria/diario/2026-11-17_claude_prototipo-do-app.md`.
