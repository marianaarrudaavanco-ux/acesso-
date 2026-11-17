import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LINHAS } from '../data/linhas'
import { ESTACOES } from '../data/estacoes'

export default function Mapa() {
  // null = todas as linhas
  const [filtro, setFiltro] = useState<number | null>(null)
  const visiveis = filtro === null ? ESTACOES : ESTACOES.filter((e) => e.linha === filtro)

  return (
    <>
      <h1>Mapa das estações</h1>
      <p>
        Toque numa bolinha para ver o nome da estação. Prefere lista? Todas as estações estão também na tela de{' '}
        <Link to="/">Linhas</Link>.
      </p>

      <fieldset className="filtros">
        <legend>Mostrar</legend>
        <button type="button" aria-pressed={filtro === null} onClick={() => setFiltro(null)}>Todas</button>
        {LINHAS.map((l) => (
          <button
            key={l.numero}
            type="button"
            aria-pressed={filtro === l.numero}
            onClick={() => setFiltro(l.numero)}
            style={{ '--cor-linha': l.cor } as React.CSSProperties}
          >
            <span className="filtros__cor" aria-hidden="true" />
            {l.numero} {l.nome}
          </button>
        ))}
      </fieldset>

      <div className="mapa">
        <MapContainer center={[-23.56, -46.63]} zoom={11} scrollWheelZoom={false} style={{ height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visiveis.map((e) => {
            const cor = LINHAS.find((l) => l.numero === e.linha)!.cor
            return (
              <CircleMarker
                key={e.id}
                center={[e.lat, e.lon]}
                radius={6}
                pathOptions={{ color: '#14161a', weight: 1.5, fillColor: cor, fillOpacity: 1 }}
              >
                <Popup>
                  <strong>{e.nome}</strong>
                  <br />
                  Linha {e.linha} · <Link to={`/estacao/${e.id}`}>Ver estação</Link>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
    </>
  )
}
