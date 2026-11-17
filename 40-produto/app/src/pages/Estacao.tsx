import { Link, useParams } from 'react-router-dom'
import SeloLinha from '../components/SeloLinha'
import { linhaPorNumero } from '../data/linhas'
import { estacaoNaLinha, estacaoPorId, linkComoChegar } from '../data/estacoes'
import { RECURSOS } from '../data/recursos'
import NaoEncontrado from './NaoEncontrado'

export default function EstacaoPage() {
  const { id = '' } = useParams()
  const estacao = estacaoPorId(id)
  if (!estacao) return <NaoEncontrado />
  const linha = linhaPorNumero(estacao.linha)!

  return (
    <article style={{ '--cor-linha': linha.cor } as React.CSSProperties}>
      <p className="voltar">
        <Link to={`/linha/${linha.numero}`}>← Linha {linha.numero}-{linha.nome}</Link>
      </p>

      <header className="cabecalho-estacao">
        <h1>{estacao.nome}</h1>
        <p className="selos">
          <SeloLinha numero={linha.numero} />
          <span>Linha {linha.numero}-{linha.nome}</span>
        </p>
      </header>

      <a className="botao" href={linkComoChegar(estacao)} target="_blank" rel="noreferrer">
        Como chegar a pé
        <span className="sr-only"> (abre o app de mapas)</span>
      </a>

      <section aria-labelledby="t-recursos" className="bloco">
        <h2 id="t-recursos">Acessibilidade</h2>
        <p className="aviso aviso--neutro">
          Ainda não verificamos os recursos desta estação. Até lá, não mostramos nada que não tenha fonte.
        </p>
        <ul className="recursos">
          {RECURSOS.map((r) => (
            <li key={r.chave}>
              <span className="recursos__icone" aria-hidden="true">{r.icone}</span>
              <span className="recursos__nome">{r.nome}</span>
              <span className="recursos__situacao">Não verificado</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="t-relatos" className="bloco">
        <h2 id="t-relatos">Avisos de quem passou por aqui</h2>
        <p>
          Em breve: quem estiver na estação vai poder avisar, por exemplo, que o elevador parou, e os outros
          confirmam se ainda está assim.
        </p>
      </section>

      {estacao.integracoes.length > 0 && (
        <section aria-labelledby="t-integracoes" className="bloco">
          <h2 id="t-integracoes">Integração</h2>
          <ul className="integracoes">
            {estacao.integracoes.map((n) => {
              const outra = estacaoNaLinha(estacao, n)
              const l = linhaPorNumero(n)!
              return outra ? (
                <li key={n}>
                  <Link to={`/estacao/${outra.id}`}>
                    <SeloLinha numero={n} />
                    <span>{outra.nome} · Linha {n}-{l.nome}</span>
                  </Link>
                </li>
              ) : null
            })}
          </ul>
        </section>
      )}
    </article>
  )
}
