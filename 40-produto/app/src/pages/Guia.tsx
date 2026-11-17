import { RECURSOS } from '../data/recursos'

export default function Guia() {
  return (
    <>
      <h1>Guia de acessibilidade</h1>
      <p>O que cada recurso quer dizer no site.</p>

      <dl className="guia">
        {RECURSOS.map((r) => (
          <div key={r.chave}>
            <dt>
              <span className="recursos__icone" aria-hidden="true">{r.icone}</span> {r.nome}
            </dt>
            <dd>{r.descricao}</dd>
          </div>
        ))}
      </dl>

      <h2>De onde vêm as informações</h2>
      <ul className="lista-simples">
        <li><strong>Estações e localização:</strong> GeoSampa, base oficial da Prefeitura de São Paulo.</li>
        <li><strong>Integração entre linhas:</strong> estações de linhas diferentes a menos de 450 metros uma da outra.</li>
        <li><strong>Mapa:</strong> OpenStreetMap.</li>
        <li><strong>Como chegar:</strong> abre a rota a pé no Google Maps, a partir de onde você está.</li>
      </ul>
    </>
  )
}
