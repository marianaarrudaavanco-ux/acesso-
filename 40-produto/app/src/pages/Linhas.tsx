import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SeloLinha from '../components/SeloLinha'
import { LINHAS, type Linha } from '../data/linhas'
import { ESTACOES, estacoesDaLinha, semAcento } from '../data/estacoes'

function terminais(linha: Linha): string {
  if (linha.numero === 17) return 'Morumbi ↔ Congonhas / Washington Luís'
  const lista = estacoesDaLinha(linha.numero)
  return `${lista[0].nome} ↔ ${lista[lista.length - 1].nome}`
}

function CartaoLinha({ linha }: { linha: Linha }) {
  return (
    <li>
      <Link to={`/linha/${linha.numero}`} className="cartao-linha" style={{ '--cor-linha': linha.cor } as React.CSSProperties}>
        <SeloLinha numero={linha.numero} />
        <span className="cartao-linha__texto">
          <strong>{linha.nome}</strong>
          <span>{terminais(linha)}</span>
        </span>
        <span className="cartao-linha__qtd">{estacoesDaLinha(linha.numero).length} estações</span>
      </Link>
    </li>
  )
}

export default function Linhas() {
  const [busca, setBusca] = useState('')
  const idBusca = useId()

  // Estações com o mesmo nome em várias linhas (ex.: Sé) aparecem uma vez só, com todos os selos.
  const resultados = useMemo(() => {
    const termo = semAcento(busca.trim())
    if (termo.length < 2) return []
    const porNome = new Map<string, { id: string; nome: string; linhas: number[] }>()
    for (const e of ESTACOES) {
      if (!semAcento(e.nome).includes(termo)) continue
      const item = porNome.get(e.nome) ?? { id: e.id, nome: e.nome, linhas: [] }
      item.linhas.push(e.linha)
      porNome.set(e.nome, item)
    }
    return [...porNome.values()].slice(0, 12)
  }, [busca])

  return (
    <>
      <section className="abertura">
        <h1>Vai dar pra usar a estação?</h1>
        <p>
          Antes de sair de casa, veja como está a estação: elevador, banheiro, rampa e piso tátil, em todas as
          linhas de metrô e trem de São Paulo.
        </p>

        <form role="search" className="busca" onSubmit={(ev) => ev.preventDefault()}>
          <label htmlFor={idBusca}>Buscar estação</label>
          <input
            id={idBusca}
            type="search"
            value={busca}
            onChange={(ev) => setBusca(ev.target.value)}
            placeholder="Ex.: Sé, Pinheiros, Luz"
            autoComplete="off"
          />
        </form>

        {/* aria-live: o leitor de tela avisa quantos resultados apareceram */}
        <div aria-live="polite">
          {busca.trim().length >= 2 && (
            <>
              <p className="busca__contagem">
                {resultados.length === 0 ? 'Nenhuma estação encontrada.' : `${resultados.length} estação(ões) encontrada(s).`}
              </p>
              <ul className="resultados">
                {resultados.map((r) => (
                  <li key={r.nome}>
                    <Link to={`/estacao/${r.id}`}>
                      <span>{r.nome}</span>
                      <span className="selos">
                        {r.linhas.map((n) => <SeloLinha key={n} numero={n} />)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="t-metro">
        <h2 id="t-metro">Metrô</h2>
        <ul className="lista-linhas">
          {LINHAS.filter((l) => l.tipo === 'metro').map((l) => <CartaoLinha key={l.numero} linha={l} />)}
        </ul>
      </section>

      <section aria-labelledby="t-trem">
        <h2 id="t-trem">Trens metropolitanos</h2>
        <ul className="lista-linhas">
          {LINHAS.filter((l) => l.tipo === 'trem').map((l) => <CartaoLinha key={l.numero} linha={l} />)}
        </ul>
      </section>

      <aside className="aviso-prototipo">
        <h2>O que ainda vem</h2>
        <p>
          Este é um protótipo. Ainda não mostramos a situação das linhas em tempo real nem os avisos da comunidade
          sobre elevadores parados. Os dois chegam nas próximas versões.
        </p>
      </aside>
    </>
  )
}
