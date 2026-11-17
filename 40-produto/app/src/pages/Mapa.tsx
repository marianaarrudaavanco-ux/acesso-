import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LINHAS, linhaPorNumero } from '../data/linhas'
import { ESTACOES } from '../data/estacoes'
import tracadosJson from '../data/tracados.json'

/** Desenho de cada linha (gerado por 30-dados/scripts/gerar_tracados.py). */
// O JSON chega como number[][][]; cada par é [lat, lon].
const TRACADOS = tracadosJson as unknown as Record<string, LatLngTuple[][]>

/** Quando escolhe uma linha, o mapa se ajusta para mostrar ela inteira. */
function Enquadrar({ limites }: { limites: LatLngBoundsExpression }) {
  const mapa = useMap()
  useEffect(() => {
    mapa.fitBounds(limites, { padding: [24, 24] })
  }, [mapa, limites])
  return null
}

export default function Mapa() {
  // null = todas as linhas
  const [filtro, setFiltro] = useState<number | null>(null)
  const visiveis = filtro === null ? ESTACOES : ESTACOES.filter((e) => e.linha === filtro)

  const limites = useMemo<LatLngBoundsExpression>(
    () => visiveis.map((e) => [e.lat, e.lon] as LatLngTuple),
    [visiveis],
  )

  return (
    <div className="pagina-mapa">
      <header className="faixa faixa--escura cabecalho-mapa">
        <h1>Mapa</h1>
        <p>
          Toque numa estação para ver o nome e abrir a página dela. As mesmas estações estão na lista de{' '}
          <Link to="/">linhas</Link>, que funciona melhor com leitor de tela.
        </p>
      </header>

      <div className="filtro-mapa">
        <label htmlFor="filtro-linha">Mostrar</label>
        <select
          id="filtro-linha"
          value={filtro ?? ''}
          onChange={(ev) => setFiltro(ev.target.value === '' ? null : Number(ev.target.value))}
        >
          <option value="">Todas as linhas</option>
          {LINHAS.map((l) => (
            <option key={l.numero} value={l.numero}>Linha {l.numero}-{l.nome}</option>
          ))}
        </select>
      </div>

      <div className="mapa">
        <MapContainer center={[-23.55, -46.63]} zoom={12} scrollWheelZoom={false} style={{ height: '100%' }}>
          {/* Fundo com ruas, bairros e parques (CARTO Voyager, dados do OpenStreetMap). */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
          {filtro !== null && <Enquadrar limites={limites} />}

          {/* Linhas por baixo, com contorno branco para destacar das ruas. */}
          {LINHAS.filter((l) => filtro === null || l.numero === filtro).map((l) =>
            (TRACADOS[String(l.numero)] ?? []).map((trecho, i) => (
              <Polyline key={`${l.numero}-${i}-borda`} positions={trecho} pathOptions={{ color: '#ffffff', weight: 8, opacity: 0.9 }} />
            )),
          )}
          {LINHAS.filter((l) => filtro === null || l.numero === filtro).map((l) =>
            (TRACADOS[String(l.numero)] ?? []).map((trecho, i) => (
              <Polyline key={`${l.numero}-${i}`} positions={trecho} pathOptions={{ color: l.cor, weight: 5 }} />
            )),
          )}

          {/* Estações como nas placas: bolinha branca com borda na cor da linha. */}
          {visiveis.map((e) => {
            const linha = linhaPorNumero(e.linha)!
            return (
              <CircleMarker
                key={e.id}
                center={[e.lat, e.lon]}
                radius={e.integracoes.length > 0 ? 7 : 5}
                pathOptions={{ color: e.integracoes.length > 0 ? '#14161a' : linha.cor, weight: 3, fillColor: '#ffffff', fillOpacity: 1 }}
              >
                <Popup>
                  <strong>{e.nome}</strong>
                  <br />
                  Linha {linha.numero}-{linha.nome}
                  <br />
                  <Link to={`/estacao/${e.id}`}>Ver a estação</Link>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}
