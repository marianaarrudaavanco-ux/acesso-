import { Link, useParams } from 'react-router-dom'
import Icone from '../components/Icone'
import SeloLinha from '../components/SeloLinha'
import { linhaPorNumero } from '../data/linhas'
import { estacaoNaLinha, estacaoPorId, linkComoChegar } from '../data/estacoes'
import { POSTOS_PCD, RECURSOS } from '../data/recursos'
import { dataCurta, TEXTO_RESULTADO, ultimaVistoria } from '../data/vistorias'
import NaoEncontrado from './NaoEncontrado'

export default function EstacaoPage() {
  const { id = '' } = useParams()
  const estacao = estacaoPorId(id)
  if (!estacao) return <NaoEncontrado />
  const linha = linhaPorNumero(estacao.linha)!
  const algumTeste = RECURSOS.some((r) => ultimaVistoria(estacao.id, r.chave))
  const temPosto = POSTOS_PCD.includes(estacao.nome)

  return (
    <article style={{ '--cor-linha': linha.cor } as React.CSSProperties}>
      {/* Cabeçalho no formato da placa com o nome da estação. */}
      <header className="faixa faixa--escura placa">
        <p className="voltar"><Link to={`/linha/${linha.numero}`}>Linha {linha.numero}-{linha.nome}</Link></p>
        <h1 className="placa__nome">{estacao.nome}</h1>
        <p className="placa__linhas">
          <SeloLinha numero={linha.numero} />
          {estacao.integracoes.map((n) => <SeloLinha key={n} numero={n} />)}
        </p>
      </header>

      <a className="botao" href={linkComoChegar(estacao)} target="_blank" rel="noreferrer">
        Como chegar a pé
        <span className="sr-only"> (abre o Google Maps)</span>
      </a>

      {temPosto && (
        <p className="aviso">
          Esta estação tem Posto de Atendimento à Pessoa com Deficiência, com conserto de cadeira de rodas e bengala.
        </p>
      )}

      <section aria-labelledby="t-recursos" className="bloco">
        <h2 id="t-recursos">Acessibilidade</h2>
        {!algumTeste && (
          <p className="nota">Ninguém do grupo testou esta estação ainda. Sem teste, não dizemos se tem ou se funciona.</p>
        )}
        <table className="tabela-recursos">
          <thead className="sr-only">
            <tr><th scope="col">Recurso</th><th scope="col">Situação</th></tr>
          </thead>
          <tbody>
            {RECURSOS.map((r) => {
              const v = ultimaVistoria(estacao.id, r.chave)
              return (
                <tr key={r.chave}>
                  <th scope="row">
                    <Icone nome={r.chave} />
                    <span>{r.nome}</span>
                  </th>
                  <td>
                    {v ? (
                      <>
                        <span className={`situacao situacao--${v.resultado}`}>{TEXTO_RESULTADO[v.resultado]}</span>
                        <span className="situacao__quando">
                          testado em {dataCurta(v.data)}{v.quem && ` por ${v.quem}`}
                          {v.observacao && `. ${v.observacao}`}
                        </span>
                      </>
                    ) : (
                      <span className="situacao situacao--sem">Não testado</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="nota"><Link to="/guia">Como usar cada recurso</Link></p>
      </section>

      <section aria-labelledby="t-relatos" className="bloco">
        <h2 id="t-relatos">Avisos de quem passou por aqui</h2>
        <p className="nota">
          Na próxima versão: quem estiver na estação vai poder avisar que o elevador parou, e os outros confirmam se
          ainda está assim.
        </p>
      </section>

      {estacao.integracoes.length > 0 && (
        <section aria-labelledby="t-integracoes" className="bloco">
          <h2 id="t-integracoes">Integração</h2>
          <ul className="lista-simples-links">
            {estacao.integracoes.map((n) => {
              const outra = estacaoNaLinha(estacao, n)
              const l = linhaPorNumero(n)!
              return outra ? (
                <li key={n}>
                  <Link to={`/estacao/${outra.id}`}>
                    <SeloLinha numero={n} tamanho="pequeno" />
                    <span>{outra.nome}, Linha {n}-{l.nome}</span>
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
