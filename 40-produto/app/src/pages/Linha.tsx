import { Link, useParams } from 'react-router-dom'
import SeloLinha from '../components/SeloLinha'
import { corDoTexto, linhaPorNumero } from '../data/linhas'
import { estacoesDaLinha } from '../data/estacoes'
import NaoEncontrado from './NaoEncontrado'

/**
 * A linha desenhada como nas placas das plataformas: uma faixa vertical na cor
 * da linha, com uma bolinha por estação. Cada estação é um link grande (fácil de tocar).
 */
export default function LinhaPage() {
  const { numero } = useParams()
  const linha = linhaPorNumero(Number(numero))
  if (!linha) return <NaoEncontrado />

  const estacoes = estacoesDaLinha(linha.numero)

  return (
    <article style={{ '--cor-linha': linha.cor } as React.CSSProperties}>
      <header className="faixa faixa-linha" style={{ background: linha.cor, color: corDoTexto(linha.cor) }}>
        <p className="voltar"><Link to="/">Todas as linhas</Link></p>
        <div className="faixa-linha__titulo">
          <span className="faixa-linha__numero" aria-hidden="true">{linha.numero}</span>
          <h1>Linha {linha.numero}-{linha.nome}</h1>
        </div>
      </header>

      <dl className="ficha">
        <div><dt>Operadora</dt><dd>{linha.operadora ?? 'A confirmar'}</dd></div>
        <div><dt>Estações</dt><dd>{estacoes.length}</dd></div>
      </dl>

      {linha.aviso && <p className="aviso">{linha.aviso}</p>}
      {linha.numero === 17 && (
        <p className="aviso aviso--neutro">
          A linha tem formato de Y: depois de Brooklin Paulista ela se divide entre Aeroporto de Congonhas e
          Washington Luís.
        </p>
      )}

      <h2 className="sr-only">Estações, na ordem da linha</h2>
      <ol className="diagrama">
        {estacoes.map((e) => (
          <li key={e.id}>
            <Link to={`/estacao/${e.id}`} className="diagrama__estacao">
              <span className="diagrama__ponto" aria-hidden="true" />
              <span className="diagrama__nome">{e.nome}</span>
              {e.integracoes.length > 0 && (
                <span className="selos">
                  <span className="sr-only">Integração com</span>
                  {e.integracoes.map((n) => <SeloLinha key={n} numero={n} tamanho="pequeno" />)}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </article>
  )
}
