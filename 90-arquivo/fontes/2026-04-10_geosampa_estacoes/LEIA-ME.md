# Estações e linhas do GeoSampa (Prefeitura de São Paulo)

Arquivos originais (GeoPackage, SIRGAS 2000 / UTM 23S, EPSG:31983), sem edição.

- Origem: GeoSampa (https://geosampa.prefeitura.sp.gov.br), camadas de estações de metrô e trem, em operação e projetadas.
- Baixados do repositório https://github.com/viniciusoike/metrosp (pasta `data-raw/inputs/geosampa/`, licença MIT), que informa última atualização dos dados em 2026-04-10.
- Copiados em 2026-11-17 por `claude`.

Estações: `SIRGAS_GPKG_estacao*.gpkg`. Traçados das linhas: `SIRGAS_GPKG_linha*.gpkg` (copiados em 2026-11-17).

Usados por `30-dados/scripts/gerar_estacoes.py` e `30-dados/scripts/gerar_tracados.py`.
