import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SeloLinha from '../components/SeloLinha'
import { LINHAS, type Linha } from '../data/linhas'
import { ESTACOES, estacoesDaLinha, semAcento } from '../data/estacoes'

function terminais(linha: Linha): string {
  if (linha.numero === 17) return 'Morumbi · Congonhas · Washington Luís'
  const lista = estacoesDaLinha(linha.numero)
  return `${lista[0].nome} · ${lista[lista.length - 1].nome}`
}

function ListaLinhas({ titulo, tipo }: { titulo: string; tipo: Linha['tipo'] }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="grupo-linhas">
      <h2 id={id}>{titulo}</h2>
      <ul className="lista-linhas">
        {LINHAS.filter((l) => l.tipo === tipo).map((l) => (
          <li key={l.numero}>
            <Link to={`/linha/${l.numero}`} className="linha-item">
              <SeloLinha numero={l.numero} />
              <span className="linha-item__texto">
                <span className="linha-item__nome">{l.nome}</span>
                <span className="linha-item__terminais">{terminais(l)}</span>
              </span>
              <span className="linha-item__qtd">{estacoesDaLinha(l.numero).length}<span className="sr-only"> estações</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
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
      <section className="faixa faixa--escura busca-faixa">
        <h1 className="busca-faixa__titulo">Elevador, banheiro, rampa e piso tátil em cada estação de metrô e trem de São Paulo.</h1>

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
        <div aria-live="polite" className="busca__saida">
          {busca.trim().length >= 2 && (
            <>
              <p className="busca__contagem">
                {resultados.length === 0
                  ? 'Nenhuma estação com esse nome.'
                  : resultados.length === 1 ? '1 estação' : `${resultados.length} estações`}
              </p>
              <ul className="resultados">
                {resultados.map((r) => (
                  <li key={r.nome}>
                    <Link to={`/estacao/${r.id}`}>
                      <span>{r.nome}</span>
                      <span className="selos">
                        {r.linhas.map((n) => <SeloLinha key={n} numero={n} tamanho="pequeno" />)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <div className="colunas-linhas">
        <ListaLinhas titulo="Metrô" tipo="metro" />
        <ListaLinhas titulo="Trens metropolitanos" tipo="trem" />
      </div>
    </>
  )
}
