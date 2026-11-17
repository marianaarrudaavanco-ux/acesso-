"""
Gera 40-produto/app/src/data/estacoes.json a partir dos arquivos do GeoSampa.

Uso (na raiz do repositório):
    pip install pyproj
    python 30-dados/scripts/gerar_estacoes.py

O que o script faz, e por quê:
1. Lê as estações em operação de metrô e trem (GeoPackage é um SQLite por dentro).
2. Converte as coordenadas de UTM (metros) para latitude/longitude, que é o que o mapa usa.
3. Corrige problemas conhecidos da base (ver CORRECOES abaixo), sempre com fonte.
4. Ordena as estações ao longo da linha. A base não traz a ordem, então ela é
   calculada pelo caminho mais curto que passa por todas, começando no terminal
   indicado em INICIO. A Linha 17 tem formato de Y e por isso a ordem é fixa.
5. Marca integrações: estações de linhas diferentes a menos de 450 m
   (o Brás da Linha 3 fica a 438 m do Brás da CPTM; as duas Lapas, separadas, a 546 m).
"""
import json
import math
import sqlite3
import struct
import unicodedata
from pathlib import Path

from pyproj import Transformer

RAIZ = Path(__file__).resolve().parents[2]
FONTES = RAIZ / "90-arquivo/fontes/2026-04-10_geosampa_estacoes"
SAIDA = RAIZ / "40-produto/app/src/data/estacoes.json"

UTM_PARA_LATLON = Transformer.from_crs(31983, 4326, always_xy=True)

LINHA_METRO = {"AZUL": 1, "VERDE": 2, "VERMELHA": 3, "AMARELA": 4, "LILAS": 5, "PRATA": 15, "OURO": 17}

# Terminal por onde a lista de cada linha começa.
INICIO = {
    1: "TUCURUVI", 2: "VILA MADALENA", 3: "PALMEIRAS-BARRA FUNDA", 4: "LUZ",
    5: "CAPÃO REDONDO", 15: "VILA PRUDENTE", 7: "PALMEIRAS - BARRA FUNDA",
    8: "JÚLIO PRESTES", 9: "OSASCO", 10: "PALMEIRAS - BARRA FUNDA",
    11: "PALMEIRAS - BARRA FUNDA", 12: "BRÁS", 13: "ENGENHEIRO GOULART",
}

# Linha 17 em Y: tronco Morumbi -> Brooklin Paulista, depois os dois ramais.
# Fonte das estações abertas: https://moovit.com/pt/blog/conheca-a-linha-17-ouro-do-metro-de-sao-paulo/
# e https://diariodotransporte.com.br/2026/06/30/linha-17-ouro-tem-horario-de-operacao-ampliado-em-duas-horas-estacao-washington-luis-e-inaugurada-nesta-terca-30-com-12-anos-de-atraso/
ORDEM_L17 = ["MORUMBI", "CHUCRI ZAIDAN", "VILA CORDEIRO", "CAMPO BELO", "JOSÉ DINIZ",
             "BROOKLIN PAULISTA", "AEROPORTO DE CONGONHAS", "WASHINGTON LUIS"]

# Nomes que a base escreve diferente do nome usado nas estações.
NOMES = {"JOSÉ DINIZ": "Vereador José Diniz", "WASHINGTON LUIS": "Washington Luís",
         "LAPA (LINHA 7)": "Lapa", "LAPA (LINHA 8)": "Lapa", "SANTO AMARO (LINHA 9)": "Santo Amaro"}

SIGLAS = {"AACD", "USP", "MASP", "CECAP", "II"}
MINUSCULAS = {"de", "da", "do", "das", "dos", "e"}


def ponto(geom: bytes) -> tuple[float, float]:
    """Lê um ponto no formato binário do GeoPackage e devolve (lat, lon)."""
    envelope = (geom[3] >> 1) & 7
    inicio_wkb = 8 + {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[envelope]
    wkb = geom[inicio_wkb:]
    ordem = "<" if wkb[0] == 1 else ">"
    x, y = struct.unpack(ordem + "dd", wkb[5:21])
    lon, lat = UTM_PARA_LATLON.transform(x, y)
    return round(lat, 6), round(lon, 6)


def nome_bonito(bruto: str) -> str:
    if bruto in NOMES:
        return NOMES[bruto]
    palavras = []
    for i, p in enumerate(bruto.replace("-", " - ").replace("/", " / ").split()):
        if p in SIGLAS:
            palavras.append(p)
        elif p.lower() in MINUSCULAS and i > 0:
            palavras.append(p.lower())
        else:
            palavras.append(p.capitalize())
    return " ".join(palavras).replace(" - ", "-")


def slug(texto: str) -> str:
    t = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode().lower()
    return "-".join("".join(c if c.isalnum() else " " for c in t).split())


def distancia_m(a, b) -> float:
    lat = math.radians((a[0] + b[0]) / 2)
    dx = (a[1] - b[1]) * 111_320 * math.cos(lat)
    dy = (a[0] - b[0]) * 110_540
    return math.hypot(dx, dy)


def ordenar(estacoes: list[dict], inicio: str) -> list[dict]:
    """Caminho curto que passa por todas: vizinho mais próximo + melhoria 2-opt."""
    restantes = estacoes[:]
    atual = next(e for e in restantes if e["bruto"] == inicio)
    caminho = [atual]
    restantes.remove(atual)
    while restantes:
        atual = min(restantes, key=lambda e: distancia_m(caminho[-1]["coord"], e["coord"]))
        caminho.append(atual)
        restantes.remove(atual)

    def custo(c):
        return sum(distancia_m(c[i]["coord"], c[i + 1]["coord"]) for i in range(len(c) - 1))

    melhorou = True
    while melhorou:
        melhorou = False
        for i in range(1, len(caminho) - 1):
            for j in range(i + 1, len(caminho)):
                novo = caminho[:i] + caminho[i:j + 1][::-1] + caminho[j + 1:]
                if custo(novo) < custo(caminho) - 1:
                    caminho, melhorou = novo, True
    return caminho


def main():
    brutas: dict[int, list[dict]] = {}

    def adicionar(linha, bruto, geom):
        lista = brutas.setdefault(linha, [])
        if any(e["bruto"] == bruto for e in lista):
            return  # CORRECAO: a base traz Vila Mariana (Linha 1) duas vezes
        lista.append({"bruto": bruto, "coord": ponto(geom)})

    metro = sqlite3.connect(FONTES / "SIRGAS_GPKG_estacaometro.gpkg")
    for geom, nome, linha, situacao in metro.execute(
            "select geom, emt_nome, emt_linha, emt_situac from SIRGAS_GPKG_estacaometro"):
        if situacao == "OPERANDO":
            adicionar(LINHA_METRO[linha], nome, geom)

    trem = sqlite3.connect(FONTES / "SIRGAS_GPKG_estacaotrem.gpkg")
    for geom, nome, nr, situacao in trem.execute(
            "select geom, estacao, nr_linha, situacao from SIRGAS_GPKG_estacaotrem"):
        if situacao == "OPERANDO":
            adicionar(int(nr), nome, geom)

    # CORRECOES: estações que já abriram mas a base ainda lista como projetadas.
    # Jardim Colonial: o Metrô conta 11 estações na Linha 15 em 2026
    # (https://transparencia.metrosp.com.br/node/5756/download).
    # Linha 17: 8 estações em operação (fontes em ORDEM_L17).
    projeto = sqlite3.connect(FONTES / "SIRGAS_GPKG_estacaometroprojeto.gpkg")
    for geom, nome, linha in projeto.execute(
            "select geom, emtp_nome, emtp_linha from SIRGAS_GPKG_estacaometroprojeto"):
        if (linha == "PRATA" and nome == "JARDIM COLONIAL") or (linha == "OURO" and nome in ORDEM_L17):
            adicionar(LINHA_METRO[linha], nome, geom)

    saida = []
    for linha, estacoes in sorted(brutas.items()):
        if linha == 17:
            ordem = sorted(estacoes, key=lambda e: ORDEM_L17.index(e["bruto"]))
        else:
            ordem = ordenar(estacoes, INICIO[linha])
        for e in ordem:
            nome = nome_bonito(e["bruto"])
            saida.append({"id": f"{linha}-{slug(nome)}", "nome": nome, "linha": linha,
                          "lat": e["coord"][0], "lon": e["coord"][1]})

    for e in saida:
        e["integracoes"] = sorted({o["linha"] for o in saida if o["linha"] != e["linha"]
                                   and distancia_m((e["lat"], e["lon"]), (o["lat"], o["lon"])) < 450})

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(json.dumps(saida, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(saida)} estações em {len(brutas)} linhas -> {SAIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
