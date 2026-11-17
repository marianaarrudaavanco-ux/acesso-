import { Link, useParams } from 'react-router-dom'
import SeloLinha from '../components/SeloLinha'
import { linhaPorNumero } from '../data/linhas'
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
      <p className="voltar"><Link to="/">← Todas as linhas</Link></p>

      <header className="cabecalho-linha">
        <SeloLinha numero={linha.numero} tamanho="grande" />
        <div>
          <h1>Linha {linha.numero}-{linha.nome}</h1>
          <p>
            {linha.operadora ? `Operada por ${linha.operadora}` : 'Operadora a confirmar'} · {estacoes.length} estações
          </p>
        </div>
      </header>

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
                  {e.integracoes.map((n) => <SeloLinha key={n} numero={n} />)}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </article>
  )
}
