"""
Gera 40-produto/app/src/data/tracados.json: o desenho de cada linha para o mapa.

Uso (na raiz do repositório):
    pip install pyproj shapely
    python 30-dados/scripts/gerar_tracados.py

O que o script faz, e por quê:
1. Lê os traçados de metrô e trem do GeoSampa (em operação).
2. A Linha 17 só existe na camada de projetos, com os 17 km planejados. Recortamos só o
   trecho em operação: a parte de cada segmento entre as estações abertas (as que estão no
   estacoes.json), para não desenhar linha onde não passa trem.
3. Simplifica o desenho (tolerância de 8 m) para o arquivo ficar leve no celular.
4. Converte para latitude/longitude, com 5 casas decimais (~1 m de precisão).
"""
import json
import sqlite3
from pathlib import Path

from pyproj import Transformer
from shapely import wkb
from shapely.geometry import LineString, Point
from shapely.ops import substring, transform

RAIZ = Path(__file__).resolve().parents[2]
FONTES = RAIZ / "90-arquivo/fontes/2026-04-10_geosampa_estacoes"
ESTACOES = RAIZ / "40-produto/app/src/data/estacoes.json"
SAIDA = RAIZ / "40-produto/app/src/data/tracados.json"

UTM_PARA_LATLON = Transformer.from_crs(31983, 4326, always_xy=True)
LATLON_PARA_UTM = Transformer.from_crs(4326, 31983, always_xy=True)
LINHA_METRO = {"AZUL": 1, "VERDE": 2, "VERMELHA": 3, "AMARELA": 4, "LILAS": 5, "PRATA": 15}


def geometria(geom: bytes):
    envelope = (geom[3] >> 1) & 7
    return wkb.loads(bytes(geom[8 + {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[envelope]:]))


def para_latlon(linha: LineString) -> list[list[float]]:
    simples = linha.simplify(8)
    return [[round(lat, 5), round(lon, 5)] for lon, lat in
            (UTM_PARA_LATLON.transform(x, y) for x, y in simples.coords)]


def recortar_l17(segmento: LineString, estacoes_utm: list[Point], outros: list[LineString]) -> LineString | None:
    """
    Fica só com o trecho do segmento entre as estações abertas que estão perto dele.
    A linha é um Y: a bifurcação fica na ponta de cada segmento, sem estação. Por isso a ponta
    que encosta em outro segmento também conta como limite do recorte.
    """
    perto = [segmento.project(p) for p in estacoes_utm if segmento.distance(p) < 150]
    if not perto:
        return None
    for ponta in (Point(segmento.coords[0]), Point(segmento.coords[-1])):
        if any(o.distance(ponta) < 30 for o in outros):
            perto.append(segmento.project(ponta))
    if max(perto) - min(perto) <= 0:
        return None
    return substring(segmento, min(perto), max(perto))


def main():
    tracados: dict[int, list] = {}

    metro = sqlite3.connect(FONTES / "SIRGAS_GPKG_linhametro.gpkg")
    for geom, nome in metro.execute("select geom, lmt_nome from SIRGAS_GPKG_linhametro"):
        tracados.setdefault(LINHA_METRO[nome], []).append(para_latlon(geometria(geom)))

    trem = sqlite3.connect(FONTES / "SIRGAS_GPKG_linhatrem.gpkg")
    for geom, nr, situacao in trem.execute("select geom, nr_linha, situacao from SIRGAS_GPKG_linhatrem"):
        if situacao == "OPERANDO":
            tracados.setdefault(int(nr), []).append(para_latlon(geometria(geom)))

    estacoes = json.loads(ESTACOES.read_text(encoding="utf-8"))
    abertas_l17 = [Point(LATLON_PARA_UTM.transform(e["lon"], e["lat"])) for e in estacoes if e["linha"] == 17]
    projeto = sqlite3.connect(FONTES / "SIRGAS_GPKG_linhametroprojeto.gpkg")
    segmentos = [geometria(g) for (g,) in projeto.execute(
        "select geom from SIRGAS_GPKG_linhametroprojeto where lmtp_nome = 'OURO'")]
    for i, seg in enumerate(segmentos):
        trecho = recortar_l17(seg, abertas_l17, segmentos[:i] + segmentos[i + 1:])
        if trecho is not None:
            tracados.setdefault(17, []).append(para_latlon(trecho))

    SAIDA.write_text(json.dumps({str(k): v for k, v in sorted(tracados.items())}, separators=(",", ":")),
                     encoding="utf-8")
    pontos = sum(len(s) for segs in tracados.values() for s in segs)
    print(f"{len(tracados)} linhas, {pontos} pontos -> {SAIDA.relative_to(RAIZ)} "
          f"({SAIDA.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
