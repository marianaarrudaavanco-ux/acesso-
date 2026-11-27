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
import { corDoTexto, LINHAS, linhaPorNumero } from '../data/linhas'
import { ESTACOES, estacaoPorId, linkComoChegar, semAcento, type Estacao } from '../data/estacoes'
import { RECURSOS } from '../data/recursos'
import { TEXTO_RESULTADO, ultimaVistoria } from '../data/vistorias'
import MapaSP from '../mapa/MapaSP'
import { distanciaM, maisProximas, textoDistancia, type Posicao } from '../mapa/geo'
import { calcularRota, textoTempo, type Rota, type TipoRota } from '../mapa/rota'
import { useBrilhoVidro } from '../components/useBrilhoVidro'
import { haQuanto, idsDoMesmoLugar, textoTipo, useRelatos, type Relato } from '../data/relatos'
import { useTema } from '../components/tema'

// Altura do painel no celular: só a alça, metade da tela ou quase tudo (para ler a rota).
type Altura = 'fechado' | 'meio' | 'cheio'
type EstadoLocal = 'parado' | 'buscando' | 'ok' | 'negado' | 'erro'
type EstadoRota = { situacao: 'parado' } | { situacao: 'calculando'; tipo: TipoRota } | { situacao: 'ok'; rota: Rota } | { situacao: 'erro'; tipo: TipoRota }

export default function Inicio() {
  const [filtro, setFiltro] = useState<number | null>(null)
  const [selecionada, setSelecionada] = useState<Estacao | null>(null)
  const [voce, setVoce] = useState<Posicao | null>(null)
  const [local, setLocal] = useState<EstadoLocal>('parado')
  const [rota, setRota] = useState<EstadoRota>({ situacao: 'parado' })
  const [foco, setFoco] = useState<{ alvo: Posicao; zoom?: number; n: number } | null>(null)
  const [altura, setAltura] = useState<Altura>('meio')
  const [arrastando, setArrastando] = useState(false)
  const painel = useRef<HTMLElement>(null)
  const arrasto = useRef<{ y: number; h: number; alvo: number; moveu: boolean } | null>(null)
  const ignorarClique = useRef(false)
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
    setAltura((a) => (a === 'fechado' ? 'meio' : a))
    navigator.vibrate?.(10) // toque leve no celular (o iPhone ignora)
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

  // Arrastar a alça do painel, como nos apps de mapa. Só no celular: no computador o painel é lateral.
  // Tocar (sem arrastar) ou usar o teclado continua abrindo e fechando pelo onClick.
  function comecarArrasto(ev: React.PointerEvent<HTMLButtonElement>) {
    const el = painel.current
    if (!el || window.matchMedia('(min-width: 52rem)').matches) return
    arrasto.current = { y: ev.clientY, h: el.getBoundingClientRect().height, alvo: 0, moveu: false }
    ev.currentTarget.setPointerCapture(ev.pointerId)
  }
  function moverArrasto(ev: React.PointerEvent<HTMLButtonElement>) {
    const a = arrasto.current
    const el = painel.current
    if (!a || !el) return
    const dy = ev.clientY - a.y
    if (!a.moveu && Math.abs(dy) < 6) return
    if (!a.moveu) { a.moveu = true; setArrastando(true) }
    const limite = el.parentElement!.clientHeight * 0.88
    a.alvo = Math.min(limite, Math.max(44, a.h - dy))
    el.style.maxHeight = `${a.alvo}px`
  }
  function soltarArrasto() {
    const a = arrasto.current
    const el = painel.current
    arrasto.current = null
    if (!a?.moveu || !el) return
    // Usa a altura que o dedo pediu, não a medida: com pouco conteúdo o painel não cresce de verdade.
    const proporcao = a.alvo / el.parentElement!.clientHeight
    el.style.maxHeight = ''
    setArrastando(false)
    setAltura(proporcao > 0.62 ? 'cheio' : proporcao > 0.18 ? 'meio' : 'fechado')
    // O navegador às vezes dispara um clique logo depois do arrasto: ignora só esse.
    ignorarClique.current = true
    setTimeout(() => { ignorarClique.current = false }, 80)
  }

  const aberto = altura !== 'fechado'
  // Avisos de passageiros de todas as estações: viram alerta no mapa, na lista e no painel.
  const tema = useTema()
  const { lista: avisos } = useRelatos(null)
  // Um aviso na Sé da Linha 1 marca também a Sé da Linha 3 (é o mesmo lugar).
  const idsComAviso = useMemo(() => {
    const nomes = new Set(avisos.map((a) => estacaoPorId(a.estacao_id)?.nome))
    return ESTACOES.filter((e) => nomes.has(e.nome)).map((e) => e.id)
  }, [avisos])
  const estacoesComAviso = useMemo(() => {
    const porNome = new Map<string, { estacao: Estacao; avisos: Relato[] }>()
    for (const a of avisos) {
      const e = estacaoPorId(a.estacao_id)
      if (!e) continue
      const item = porNome.get(e.nome) ?? { estacao: e, avisos: [] }
      item.avisos.push(a)
      porNome.set(e.nome, item)
    }
    return [...porNome.values()]
  }, [avisos])
  const avisosDe = (e: Estacao) => {
    const ids = idsDoMesmoLugar(e)
    return avisos.filter((a) => ids.includes(a.estacao_id))
  }

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
        alertas={idsComAviso}
        escuro={tema === 'escuro'}
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

      <section
        ref={painel}
        className={`painel vidro vidro--claro painel--${altura} ${aberto ? 'painel--aberto' : ''} ${arrastando ? 'painel--arrastando' : ''}`}
        aria-labelledby="titulo-painel"
      >
        <button
          type="button"
          className="painel__alca"
          aria-expanded={aberto}
          aria-controls="conteudo-painel"
          onPointerDown={comecarArrasto}
          onPointerMove={moverArrasto}
          onPointerUp={soltarArrasto}
          onPointerCancel={soltarArrasto}
          onClick={() => {
            if (ignorarClique.current) { ignorarClique.current = false; return }
            setAltura((a) => (a === 'fechado' ? 'meio' : 'fechado'))
          }}
        >
          <span className="painel__puxador" aria-hidden="true" />
          <span className="sr-only">{aberto ? 'Recolher painel' : 'Abrir painel'}</span>
        </button>

        <div id="conteudo-painel" className="painel__conteudo" hidden={!aberto && !arrastando}>
          {selecionada ? (
            <PainelEstacao
              estacao={selecionada}
              voce={voce}
              rota={rota}
              local={local}
              avisos={avisosDe(selecionada)}
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
                    Busque ou toque numa estação. Com a sua localização, mostramos as mais perto e a rota a pé.
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
                        <span className="lista-perto__nome">
                          {idsComAviso.includes(estacao.id) && <span className="relato__alerta relato__alerta--pequeno" aria-hidden="true">!</span>}
                          {estacao.nome}
                          {idsComAviso.includes(estacao.id) && <span className="sr-only"> (tem aviso de passageiro)</span>}
                        </span>
                        <span className="selos">{linhas.map((n) => <SeloLinha key={n} numero={n} tamanho="pequeno" />)}</span>
                        <span className="lista-perto__dist">{textoDistancia(metros)}<span className="sr-only"> em linha reta</span></span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {estacoesComAviso.length > 0 && (
                <div className="avisos-lista">
                  <p className="painel__rotulo">Avisos de passageiros agora</p>
                  <ul>
                    {estacoesComAviso.map(({ estacao, avisos: lista }) => (
                      <li key={estacao.nome}>
                        <button type="button" onClick={() => selecionar(estacao)}>
                          <span className="relato__alerta relato__alerta--pequeno" aria-hidden="true">!</span>
                          <span>
                            <strong>{estacao.nome}</strong>: {textoTipo(lista[0].tipo).toLowerCase()}
                            {lista.length > 1 && ` e mais ${lista.length - 1}`}, {haQuanto(lista[0].criado_em)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="painel__rodape">
                <p className="painel__rotulo" id="rotulo-filtro">Mostrar no mapa</p>
                {/* Chips em vez de lista suspensa: dá para ver todas as linhas e trocar com um toque. */}
                <div className="chips-linhas" role="group" aria-labelledby="rotulo-filtro">
                  <button type="button" className="chip-linha chip-linha--todas" aria-pressed={filtro === null} onClick={() => setFiltro(null)}>
                    Todas
                  </button>
                  {LINHAS.map((l) => (
                    <button
                      key={l.numero}
                      type="button"
                      className="chip-linha"
                      aria-pressed={filtro === l.numero}
                      aria-label={`Só a Linha ${l.numero}-${l.nome}`}
                      style={{ '--cor': l.cor, '--cor-texto': corDoTexto(l.cor) } as React.CSSProperties}
                      onClick={() => setFiltro((f) => (f === l.numero ? null : l.numero))}
                    >
                      <span aria-hidden="true">{l.numero}</span>
                    </button>
                  ))}
                </div>
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

function PainelEstacao({ estacao, voce, rota, local, avisos, tituloRef, aoFechar, aoPedirRota }: {
  estacao: Estacao
  voce: Posicao | null
  rota: EstadoRota
  local: EstadoLocal
  avisos: Relato[]
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

      <AvisosAgora estacao={estacao} lista={avisos} />

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

/** Resumo dos avisos de passageiros no painel do mapa; os detalhes ficam na página da estação. */
function AvisosAgora({ estacao, lista }: { estacao: Estacao; lista: Relato[] }) {
  if (lista.length === 0) return null
  const [primeiro, ...resto] = lista
  return (
    <Link to={`/estacao/${estacao.id}`} className="avisos-agora">
      <span className="relato__alerta" aria-hidden="true">!</span>
      <span>
        <strong>{textoTipo(primeiro.tipo)}</strong>, avisado {haQuanto(primeiro.criado_em)}
        {resto.length > 0 && ` e mais ${resto.length} ${resto.length === 1 ? 'aviso' : 'avisos'}`}.{' '}
        <span className="avisos-agora__ver">Ver avisos</span>
      </span>
    </Link>
  )
}
