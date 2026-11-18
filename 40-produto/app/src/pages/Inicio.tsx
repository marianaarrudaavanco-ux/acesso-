/**
 * Tela inicial: o mapa em tela cheia, com a interface flutuando por cima em vidro.
 *
 * Fluxo: buscar ou tocar numa estação → ver o resumo dela no painel → pedir a rota a pé
 * (normal ou sem escadas) a partir de onde você está → seguir o passo a passo.
 * Tudo que dá para fazer no mapa também dá pelo painel e pela busca (teclado e leitor de tela).
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SeloLinha from '../components/SeloLinha'
import { LINHAS, linhaPorNumero } from '../data/linhas'
import { ESTACOES, estacaoPorId, linkComoChegar, semAcento, type Estacao } from '../data/estacoes'
import { RECURSOS } from '../data/recursos'
import { TEXTO_RESULTADO, ultimaVistoria } from '../data/vistorias'
import MapaSP from '../mapa/MapaSP'
import { distanciaM, maisProximas, textoDistancia, type Posicao } from '../mapa/geo'
import { calcularRota, textoTempo, type Rota, type TipoRota } from '../mapa/rota'
import { useBrilhoVidro } from '../components/useBrilhoVidro'

type EstadoLocal = 'parado' | 'buscando' | 'ok' | 'negado' | 'erro'
type EstadoRota = { situacao: 'parado' } | { situacao: 'calculando'; tipo: TipoRota } | { situacao: 'ok'; rota: Rota } | { situacao: 'erro'; tipo: TipoRota }

export default function Inicio() {
  const [filtro, setFiltro] = useState<number | null>(null)
  const [selecionada, setSelecionada] = useState<Estacao | null>(null)
  const [voce, setVoce] = useState<Posicao | null>(null)
  const [local, setLocal] = useState<EstadoLocal>('parado')
  const [rota, setRota] = useState<EstadoRota>({ situacao: 'parado' })
  const [foco, setFoco] = useState<{ alvo: Posicao; zoom?: number; n: number } | null>(null)
  const [aberto, setAberto] = useState(true)
  const zoom = useRef<{ zoomMais: () => void; zoomMenos: () => void } | null>(null)
  const pedidoRota = useRef<AbortController | null>(null)
  const tituloPainel = useRef<HTMLHeadingElement>(null)
  // A estação escolhida fica no endereço (/?estacao=1-tucuruvi). Assim o botão "Ver no mapa"
  // da página da estação abre o mapa já nela, e dá para mandar o link para alguém.
  const [parametros, setParametros] = useSearchParams()

  const voar = (alvo: Posicao, z?: number) => setFoco((f) => ({ alvo, zoom: z, n: (f?.n ?? 0) + 1 }))

  function selecionar(e: Estacao) {
    pedidoRota.current?.abort()
    setRota({ situacao: 'parado' })
    setSelecionada(e)
    setParametros({ estacao: e.id }, { replace: true })
    setAberto(true)
    voar(e, 15.5)
    // Leva o foco do teclado para o painel, que é onde a resposta apareceu.
    requestAnimationFrame(() => tituloPainel.current?.focus())
  }

  function fechar() {
    pedidoRota.current?.abort()
    setSelecionada(null)
    setRota({ situacao: 'parado' })
    setParametros({}, { replace: true })
  }

  // Chegou com ?estacao=... (veio do botão "Ver no mapa"): já abre nessa estação.
  useEffect(() => {
    const e = estacaoPorId(parametros.get('estacao') ?? '')
    if (e) selecionar(e)
    // Só na chegada à tela: depois, quem muda o endereço é o próprio selecionar/fechar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function ondeEstou(depois?: (p: Posicao) => void) {
    if (!('geolocation' in navigator)) { setLocal('erro'); return }
    setLocal('buscando')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        setVoce(p)
        setLocal('ok')
        if (depois) depois(p)
        else voar(p, 15)
      },
      (erro) => setLocal(erro.code === erro.PERMISSION_DENIED ? 'negado' : 'erro'),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    )
  }

  async function pedirRota(tipo: TipoRota) {
    if (!selecionada) return
    // Sem localização ainda: pede primeiro e continua depois.
    if (!voce) { ondeEstou((p) => void buscarRota(p, selecionada, tipo)); return }
    await buscarRota(voce, selecionada, tipo)
  }

  async function buscarRota(de: Posicao, para: Estacao, tipo: TipoRota) {
    pedidoRota.current?.abort()
    const controle = new AbortController()
    pedidoRota.current = controle
    setRota({ situacao: 'calculando', tipo })
    try {
      const r = await calcularRota(de, para, tipo, controle.signal)
      setRota({ situacao: 'ok', rota: r })
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setRota({ situacao: 'erro', tipo })
    }
  }

  useEffect(() => () => pedidoRota.current?.abort(), [])

  const perto = useMemo(() => (voce ? maisProximas(voce, 5) : []), [voce])

  return (
    <div className="tela-mapa">
      <MapaSP
        filtro={filtro}
        selecionada={selecionada}
        aoSelecionar={selecionar}
        voce={voce}
        rota={rota.situacao === 'ok' ? rota.rota : null}
        foco={foco}
        aoPronto={(c) => { zoom.current = c }}
      />

      <h1 className="sr-only">Mapa de acessibilidade do metrô e dos trens de São Paulo</h1>

      <BuscaFlutuante aoEscolher={selecionar} />

      <div className="controles-mapa">
        <BotaoVidro rotulo="Mostrar onde estou" aoClicar={() => ondeEstou()} ativo={local === 'ok'}>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" fill={local === 'ok' ? 'currentColor' : 'none'} />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
          </svg>
        </BotaoVidro>
        <BotaoVidro rotulo="Aproximar o mapa" aoClicar={() => zoom.current?.zoomMais()}>
          <span aria-hidden="true" className="controle-sinal">+</span>
        </BotaoVidro>
        <BotaoVidro rotulo="Afastar o mapa" aoClicar={() => zoom.current?.zoomMenos()}>
          <span aria-hidden="true" className="controle-sinal">−</span>
        </BotaoVidro>
      </div>

      <section className={`painel vidro vidro--claro ${aberto ? 'painel--aberto' : ''}`} aria-labelledby="titulo-painel">
        <button
          type="button"
          className="painel__alca"
          aria-expanded={aberto}
          aria-controls="conteudo-painel"
          onClick={() => setAberto((a) => !a)}
        >
          <span className="painel__puxador" aria-hidden="true" />
          <span className="sr-only">{aberto ? 'Recolher painel' : 'Abrir painel'}</span>
        </button>

        <div id="conteudo-painel" className="painel__conteudo" hidden={!aberto}>
          {selecionada ? (
            <PainelEstacao
              estacao={selecionada}
              voce={voce}
              rota={rota}
              local={local}
              tituloRef={tituloPainel}
              aoFechar={fechar}
              aoPedirRota={pedirRota}
            />
          ) : (
            <>
              <h2 id="titulo-painel" ref={tituloPainel} tabIndex={-1}>
                {voce ? 'Estações perto de você' : 'Para onde você vai?'}
              </h2>
              {!voce && (
                <>
                  <p className="painel__texto">
                    Busque uma estação ou toque nela no mapa. Para ver as mais perto e traçar a rota a pé, use a sua
                    localização.
                  </p>
                  <button type="button" className="botao-acento" onClick={() => ondeEstou()} disabled={local === 'buscando'}>
                    {local === 'buscando' ? 'Procurando você…' : 'Usar minha localização'}
                  </button>
                  <AvisoLocal local={local} />
                </>
              )}
              {voce && (
                <ul className="lista-perto">
                  {perto.map(({ estacao, linhas, metros }) => (
                    <li key={estacao.id}>
                      <button type="button" onClick={() => selecionar(estacao)}>
                        <span className="lista-perto__nome">{estacao.nome}</span>
                        <span className="selos">{linhas.map((n) => <SeloLinha key={n} numero={n} tamanho="pequeno" />)}</span>
                        <span className="lista-perto__dist">{textoDistancia(metros)}<span className="sr-only"> em linha reta</span></span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="painel__rodape">
                <label className="filtro-linha">
                  <span>Mostrar</span>
                  <select value={filtro ?? ''} onChange={(ev) => setFiltro(ev.target.value === '' ? null : Number(ev.target.value))}>
                    <option value="">Todas as linhas</option>
                    {LINHAS.map((l) => <option key={l.numero} value={l.numero}>Linha {l.numero}-{l.nome}</option>)}
                  </select>
                </label>
                <Link to="/linhas" className="link-forte">Ver lista de linhas</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function AvisoLocal({ local }: { local: EstadoLocal }) {
  if (local === 'negado') return <p className="painel__erro" role="alert">Sem permissão para ver sua localização. Libere nas configurações do navegador, ou busque a estação pelo nome.</p>
  if (local === 'erro') return <p className="painel__erro" role="alert">Não deu para achar sua localização agora. Tente de novo ou busque a estação pelo nome.</p>
  return null
}

function PainelEstacao({ estacao, voce, rota, local, tituloRef, aoFechar, aoPedirRota }: {
  estacao: Estacao
  voce: Posicao | null
  rota: EstadoRota
  local: EstadoLocal
  tituloRef: React.RefObject<HTMLHeadingElement | null>
  aoFechar: () => void
  aoPedirRota: (t: TipoRota) => void
}) {
  const linha = linhaPorNumero(estacao.linha)!
  const testes = RECURSOS.map((r) => ({ r, v: ultimaVistoria(estacao.id, r.chave) })).filter((x) => x.v)
  const calculando = rota.situacao === 'calculando' || local === 'buscando'

  return (
    <div className="painel-estacao">
      <div className="painel-estacao__topo">
        <div>
          <h2 id="titulo-painel" ref={tituloRef} tabIndex={-1}>{estacao.nome}</h2>
          <p className="selos">
            <SeloLinha numero={linha.numero} tamanho="pequeno" />
            {estacao.integracoes.map((n) => <SeloLinha key={n} numero={n} tamanho="pequeno" />)}
            {voce && <span className="painel-estacao__dist">{textoDistancia(distanciaM(voce, estacao))} em linha reta</span>}
          </p>
        </div>
        <button type="button" className="botao-fechar" onClick={aoFechar}>
          <span aria-hidden="true">×</span><span className="sr-only">Fechar {estacao.nome}</span>
        </button>
      </div>

      <p className="painel-estacao__testes">
        {testes.length === 0
          ? 'Acessibilidade ainda não testada pelo grupo.'
          : `Testado pelo grupo: ${testes.map(({ r, v }) => `${r.nome.toLowerCase()} ${TEXTO_RESULTADO[v!.resultado].toLowerCase()}`).join(', ')}.`}
      </p>

      <div className="painel-estacao__acoes">
        <button type="button" className="botao-acento" onClick={() => aoPedirRota('sem-escadas')} disabled={calculando}>
          Rota sem escadas
        </button>
        <button type="button" className="botao-contorno" onClick={() => aoPedirRota('a-pe')} disabled={calculando}>
          Rota a pé
        </button>
        <Link to={`/estacao/${estacao.id}`} className="botao-contorno">Ver estação</Link>
      </div>

      <AvisoLocal local={local} />

      <div aria-live="polite">
        {calculando && <p className="painel__texto">{local === 'buscando' ? 'Procurando você…' : 'Calculando a rota…'}</p>}
        {rota.situacao === 'erro' && (
          <p className="painel__erro" role="alert">
            Não deu para calcular a rota agora.{' '}
            <a href={linkComoChegar(estacao)} target="_blank" rel="noreferrer">Abrir no Google Maps</a>
          </p>
        )}
        {rota.situacao === 'ok' && <PassoAPasso rota={rota.rota} />}
      </div>
    </div>
  )
}

function PassoAPasso({ rota }: { rota: Rota }) {
  return (
    <div className="passos">
      <p className="passos__resumo">
        <strong>{textoTempo(rota.segundos)}</strong> {rota.tipo === 'sem-escadas' ? 'sem escadas' : 'a pé'}, {textoDistancia(rota.metros)}
      </p>
      <ol>
        {rota.passos.map((p, i) => <li key={i}>{p}</li>)}
      </ol>
      <p className="nota">
        Rota calculada com o mapa colaborativo OpenStreetMap{rota.tipo === 'sem-escadas' ? ', evitando escadas que estão mapeadas' : ''}.
        Confira a calçada no caminho.
      </p>
    </div>
  )
}

function BuscaFlutuante({ aoEscolher }: { aoEscolher: (e: Estacao) => void }) {
  const [texto, setTexto] = useState('')
  const id = useId()
  const vidro = useBrilhoVidro<HTMLFormElement>()
  const resultados = useMemo(() => {
    const termo = semAcento(texto.trim())
    if (termo.length < 2) return []
    const porNome = new Map<string, { estacao: Estacao; linhas: number[] }>()
    for (const e of ESTACOES) {
      if (!semAcento(e.nome).includes(termo)) continue
      const item = porNome.get(e.nome) ?? { estacao: e, linhas: [] }
      item.linhas.push(e.linha)
      porNome.set(e.nome, item)
    }
    return [...porNome.values()].slice(0, 7)
  }, [texto])

  return (
    <div className="busca-flutuante">
      <form ref={vidro} role="search" className="vidro vidro--claro busca-flutuante__campo" onSubmit={(ev) => {
        ev.preventDefault()
        if (resultados[0]) { aoEscolher(resultados[0].estacao); setTexto('') }
      }}>
        <label htmlFor={id} className="sr-only">Buscar estação</label>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" />
        </svg>
        <input id={id} type="search" placeholder="Buscar estação" autoComplete="off" value={texto} onChange={(ev) => setTexto(ev.target.value)} />
      </form>
      <div aria-live="polite">
        {texto.trim().length >= 2 && (
          <ul className="vidro vidro--claro busca-flutuante__resultados">
            {resultados.length === 0 && <li className="busca-flutuante__vazio">Nenhuma estação com esse nome.</li>}
            {resultados.map(({ estacao, linhas }) => (
              <li key={estacao.nome}>
                <button type="button" onClick={() => { aoEscolher(estacao); setTexto('') }}>
                  <span>{estacao.nome}</span>
                  <span className="selos">{linhas.map((n) => <SeloLinha key={n} numero={n} tamanho="pequeno" />)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function BotaoVidro({ rotulo, aoClicar, ativo, children }: { rotulo: string; aoClicar: () => void; ativo?: boolean; children: React.ReactNode }) {
  const vidro = useBrilhoVidro<HTMLButtonElement>()
  return (
    <button ref={vidro} type="button" className="vidro vidro--claro botao-vidro" aria-label={rotulo} aria-pressed={ativo} onClick={aoClicar}>
      {children}
    </button>
  )
}
