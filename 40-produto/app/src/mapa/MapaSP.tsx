/**
 * O mapa da tela inicial (MapLibre).
 *
 * Por que MapLibre e não Leaflet: o mapa é vetorial, como o do Google Maps. Nome de rua e de
 * bairro aparece nítido em qualquer zoom, os prédios aparecem de perto e o zoom é suave.
 * Fundo: estilo "Liberty" do OpenFreeMap (grátis, sem chave). Se ele não carregar, o mapa
 * cai num fundo simples e as linhas continuam aparecendo (ver `estiloReserva`).
 *
 * As nossas camadas (linhas, estações, você, rota) entram por cima do fundo.
 */
import { useEffect, useRef } from 'react'
import { Map as MapLibre, setWorkerUrl, type GeoJSONSource, type StyleSpecification } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Feature, FeatureCollection } from 'geojson'
import { LINHAS, linhaPorNumero } from '../data/linhas'
import { ESTACOES, type Estacao } from '../data/estacoes'
import tracadosJson from '../data/tracados.json'
import type { Posicao } from './geo'
import type { Rota } from './rota'

setWorkerUrl(workerUrl)

// Fundo claro "Liberty" e, no modo escuro (D-012), o "Dark" do mesmo OpenFreeMap.
const ESTILO = { claro: 'https://tiles.openfreemap.org/styles/liberty', escuro: 'https://tiles.openfreemap.org/styles/dark' }
/** Vermelho dos avisos de passageiros (o mesmo --ruim do index.css, modo claro). */
const VERMELHO_AVISO = '#d93025'
const TRACADOS = tracadosJson as unknown as Record<string, [number, number][][]>
const CENTRO_SP: [number, number] = [-46.633, -23.55]
/** Azul do "você está aqui" e da rota. O mapa não lê variável CSS: é o mesmo valor de --voce em index.css. */
const AZUL_VOCE = '#1a56db'

/**
 * Quanto do mapa o painel de vidro está cobrindo, para enquadrar a rota e a estação na parte
 * visível. No celular o painel fica embaixo; no computador, na lateral esquerda.
 */
function margemDoPainel(caixa: HTMLElement) {
  const painel = document.querySelector('.painel')?.getBoundingClientRect()
  const mapa = caixa.getBoundingClientRect()
  const base = { top: 100, right: 80, bottom: 40, left: 40 }
  if (!painel) return base
  if (painel.width < mapa.width * 0.6) return { ...base, left: Math.max(40, painel.right - mapa.left + 24) }
  return { ...base, bottom: Math.max(40, mapa.bottom - painel.top + 24) }
}

/** Fundo simples para quando o OpenFreeMap não responde: só uma cor, sem ruas. */
const estiloReserva = (escuro: boolean): StyleSpecification => ({
  version: 8,
  sources: {},
  layers: [{ id: 'fundo', type: 'background', paint: { 'background-color': escuro ? '#1b1d21' : '#e9ebe4' } }],
})

const vazio: FeatureCollection = { type: 'FeatureCollection', features: [] }

function geojsonLinhas(filtro: number | null): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: LINHAS.filter((l) => filtro === null || l.numero === filtro).flatMap((l) =>
      (TRACADOS[String(l.numero)] ?? []).map((trecho) => ({
        type: 'Feature' as const,
        properties: { cor: l.cor },
        // O JSON guarda [lat, lon]; o MapLibre quer [lon, lat].
        geometry: { type: 'LineString' as const, coordinates: trecho.map(([lat, lon]) => [lon, lat]) },
      })),
    ),
  }
}

function geojsonEstacoes(filtro: number | null, selecionadaId: string | null): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: ESTACOES.filter((e) => filtro === null || e.linha === filtro).map((e) => ({
      type: 'Feature' as const,
      properties: {
        id: e.id,
        cor: linhaPorNumero(e.linha)!.cor,
        integracao: e.integracoes.length > 0,
        selecionada: e.id === selecionadaId,
      },
      geometry: { type: 'Point' as const, coordinates: [e.lon, e.lat] },
    })),
  }
}

function geojsonAlertas(ids: string[], filtro: number | null): FeatureCollection {
  const set = new Set(ids)
  return {
    type: 'FeatureCollection',
    features: ESTACOES.filter((e) => set.has(e.id) && (filtro === null || e.linha === filtro)).map((e) => ({
      type: 'Feature' as const,
      properties: { id: e.id },
      geometry: { type: 'Point' as const, coordinates: [e.lon, e.lat] },
    })),
  }
}

type Props = {
  filtro: number | null
  selecionada: Estacao | null
  aoSelecionar: (e: Estacao) => void
  voce: Posicao | null
  rota: Rota | null
  /** Pedido de enquadrar: muda o número para o mapa voar até o alvo. */
  foco: { alvo: Posicao; zoom?: number; n: number } | null
  /** Recebe os comandos de zoom dos botões de vidro. */
  aoPronto?: (comandos: { zoomMais: () => void; zoomMenos: () => void }) => void
  /** Estações com aviso de passageiro ativo: ganham o alerta vermelho. */
  alertas: string[]
  escuro: boolean
}

export default function MapaSP({ filtro, selecionada, aoSelecionar, voce, rota, foco, aoPronto, alertas, escuro }: Props) {
  const caixa = useRef<HTMLDivElement>(null)
  const mapa = useRef<MapLibre | null>(null)
  const pronto = useRef(false)
  // Guardamos as props mais recentes num ref para as funções de camada usarem sem recriar o mapa.
  const atual = useRef({ filtro, selecionada, voce, rota, alertas, escuro })
  atual.current = { filtro, selecionada, voce, rota, alertas, escuro }
  const aoSelecionarRef = useRef(aoSelecionar)
  aoSelecionarRef.current = aoSelecionar

  // Cria o mapa uma vez só.
  useEffect(() => {
    if (!caixa.current) return
    const m = new MapLibre({
      container: caixa.current,
      style: escuro ? ESTILO.escuro : ESTILO.claro,
      center: CENTRO_SP,
      zoom: 11.3,
      minZoom: 8,
      maxZoom: 19,
      attributionControl: { compact: true },
    })
    mapa.current = m
    let caiuNaReserva = false

    m.on('error', (ev) => {
      // Se o estilo do OpenFreeMap falhar antes de carregar, troca pelo fundo simples.
      if (!m.isStyleLoaded() && !caiuNaReserva) {
        caiuNaReserva = true
        console.warn('Fundo do mapa indisponível, usando o fundo simples.', ev.error?.message)
        m.setStyle(estiloReserva(atual.current.escuro))
      }
    })
    reservaRef.current = () => caiuNaReserva

    // A cada estilo carregado (o normal ou o de reserva), põe as nossas camadas por cima.
    m.on('style.load', () => {
      adicionarCamadas(m)
      pronto.current = true
      atualizarTudo()
    })

    // Tocar na estação ou no selo de alerta (que fica no canto dela) abre a estação.
    for (const camada of ['estacoes', 'alerta-selo']) {
      m.on('click', camada, (ev) => {
        const id = ev.features?.[0]?.properties?.id
        const e = ESTACOES.find((x) => x.id === id)
        if (e) aoSelecionarRef.current(e)
      })
      m.on('mouseenter', camada, () => { m.getCanvas().style.cursor = 'pointer' })
      m.on('mouseleave', camada, () => { m.getCanvas().style.cursor = '' })
    }

    aoPronto?.({ zoomMais: () => m.zoomIn(), zoomMenos: () => m.zoomOut() })

    return () => {
      pronto.current = false
      m.remove()
      mapa.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reservaRef = useRef<() => boolean>(() => false)

  // Trocou o tema: troca o fundo. O setStyle apaga as nossas camadas, e o 'style.load' põe de volta.
  const primeiraVez = useRef(true)
  useEffect(() => {
    if (primeiraVez.current) { primeiraVez.current = false; return }
    const m = mapa.current
    if (!m) return
    pronto.current = false
    m.setStyle(reservaRef.current() ? estiloReserva(escuro) : (escuro ? ESTILO.escuro : ESTILO.claro), { diff: false })
  }, [escuro])

  function adicionarCamadas(m: MapLibre) {
    // No fundo escuro, o contorno das linhas e da rota vira escuro (branco brilharia demais).
    const contorno = atual.current.escuro ? '#121417' : '#ffffff'
    m.addSource('linhas', { type: 'geojson', data: vazio })
    m.addSource('alertas', { type: 'geojson', data: vazio })
    m.addSource('estacoes', { type: 'geojson', data: vazio })
    m.addSource('rota', { type: 'geojson', data: vazio, lineMetrics: true })
    m.addSource('voce', { type: 'geojson', data: vazio })

    // Linhas com contorno branco, para destacar das ruas.
    m.addLayer({ id: 'linhas-borda', type: 'line', source: 'linhas', layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': contorno, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 5, 15, 11] } })
    m.addLayer({ id: 'linhas', type: 'line', source: 'linhas', layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': ['get', 'cor'], 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 15, 7] } })

    // Rota a pé: bolinhas azuis, a convenção de "caminho a pé" dos apps de mapa. Linha cheia
    // se confundiria com as linhas de metrô (a Linha 1 também é azul).
    m.addLayer({ id: 'rota-borda', type: 'line', source: 'rota', layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': contorno, 'line-width': 10, 'line-dasharray': [0, 1.6] } })
    m.addLayer({ id: 'rota', type: 'line', source: 'rota', layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': AZUL_VOCE, 'line-width': 6, 'line-dasharray': [0, 2] } })

    // Aviso de passageiro: halo vermelho pulsando em volta da estação (desenhado embaixo dela).
    m.addLayer({ id: 'alerta-halo', type: 'circle', source: 'alertas',
      paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 11, 15, 22], 'circle-color': VERMELHO_AVISO,
        'circle-opacity': 0.25, 'circle-stroke-color': VERMELHO_AVISO, 'circle-stroke-width': 2, 'circle-stroke-opacity': 0.7 } })

    // Estações como nas placas: bolinha branca com borda na cor da linha (preta se tem integração).
    m.addLayer({ id: 'estacoes', type: 'circle', source: 'estacoes',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, ['case', ['get', 'integracao'], 5, 3.5], 15, ['case', ['get', 'integracao'], 11, 8]],
        'circle-color': '#ffffff',
        'circle-stroke-color': ['case', ['get', 'integracao'], '#14161a', ['get', 'cor']],
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 4],
      } })
    m.addLayer({ id: 'estacao-selecionada', type: 'circle', source: 'estacoes', filter: ['==', ['get', 'selecionada'], true],
      paint: { 'circle-radius': 15, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': '#14161a', 'circle-stroke-width': 4 } })

    // E um selo vermelho com "!" no canto da estação, como os alertas do Waze.
    const canto = ['interpolate', ['linear'], ['zoom'], 10, ['literal', [7, -7]], 15, ['literal', [13, -13]]] as unknown as [number, number]
    m.addLayer({ id: 'alerta-selo', type: 'circle', source: 'alertas',
      paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 6, 15, 9], 'circle-color': VERMELHO_AVISO,
        'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2, 'circle-translate': canto } })
    // O "!" só entra se o fundo tem fontes (o fundo de reserva não tem).
    if (m.getStyle().glyphs) {
      m.addLayer({ id: 'alerta-exclamacao', type: 'symbol', source: 'alertas',
        layout: { 'text-field': '!', 'text-font': ['Noto Sans Bold'], 'text-size': ['interpolate', ['linear'], ['zoom'], 10, 10, 15, 14],
          'text-allow-overlap': true, 'text-ignore-placement': true },
        paint: { 'text-color': '#ffffff', 'text-translate': canto } })
    }

    // Você: ponto azul com halo, como nos apps de mapa.
    m.addLayer({ id: 'voce-halo', type: 'circle', source: 'voce', paint: { 'circle-radius': 18, 'circle-color': AZUL_VOCE, 'circle-opacity': 0.18 } })
    m.addLayer({ id: 'voce', type: 'circle', source: 'voce',
      paint: { 'circle-radius': 8, 'circle-color': AZUL_VOCE, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 3 } })
  }

  /**
   * O halo do alerta "respira" devagar, para chamar o olho. Só anda quando há aviso no mapa,
   * e a uns 12 quadros por segundo (redesenhar o mapa sem parar gasta bateria).
   * Com movimento reduzido, fica parado.
   */
  const pulso = useRef(0)
  function pulsar(m: MapLibre) {
    if (pulso.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ultimo = 0
    const passo = (t: number) => {
      if (!m.getLayer('alerta-halo') || atual.current.alertas.length === 0) { pulso.current = 0; return }
      if (t - ultimo > 80) {
        ultimo = t
        const fase = (Math.sin(t / 450) + 1) / 2 // 0 a 1, ~3 s por ciclo
        m.setPaintProperty('alerta-halo', 'circle-opacity', 0.12 + fase * 0.25)
      }
      pulso.current = requestAnimationFrame(passo)
    }
    pulso.current = requestAnimationFrame(passo)
  }
  useEffect(() => () => cancelAnimationFrame(pulso.current), [])

  function fonte(id: string): GeoJSONSource | undefined {
    return mapa.current?.getSource(id) as GeoJSONSource | undefined
  }

  function atualizarTudo() {
    if (!pronto.current) return
    const { filtro: f, selecionada: s, voce: v, alertas: al } = atual.current
    fonte('linhas')?.setData(geojsonLinhas(f))
    fonte('alertas')?.setData(geojsonAlertas(al, f))
    if (al.length > 0 && mapa.current) pulsar(mapa.current)
    fonte('estacoes')?.setData(geojsonEstacoes(f, s?.id ?? null))
    fonte('voce')?.setData(v ? { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [v.lon, v.lat] } } : vazio)
    desenharRota(false)
  }

  /**
   * Desenha a rota. Com animação, ela "anda" do ponto azul até a estação (o momento
   * memorável do site); com movimento reduzido, aparece inteira de uma vez.
   */
  const animacao = useRef(0)
  function desenharRota(animar: boolean) {
    const r = atual.current.rota
    cancelAnimationFrame(animacao.current)
    if (!r) { fonte('rota')?.setData(vazio); return }
    const linha = (pts: [number, number][]): Feature => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: pts } })
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!animar || semMovimento || r.caminho.length < 3) { fonte('rota')?.setData(linha(r.caminho)); return }
    const inicio = performance.now()
    const duracao = 1100
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao)
      const suave = 1 - (1 - t) ** 3
      const n = Math.max(2, Math.ceil(r.caminho.length * suave))
      fonte('rota')?.setData(linha(r.caminho.slice(0, n)))
      if (t < 1) animacao.current = requestAnimationFrame(passo)
    }
    animacao.current = requestAnimationFrame(passo)
  }

  useEffect(() => { atualizarTudo() }, [filtro, selecionada, voce, alertas]) // eslint-disable-line react-hooks/exhaustive-deps

  // Rota nova: enquadra o caminho inteiro e desenha andando.
  useEffect(() => {
    if (!pronto.current) return
    desenharRota(true)
    const r = rota
    if (r && r.caminho.length > 1 && mapa.current) {
      const lons = r.caminho.map((p) => p[0])
      const lats = r.caminho.map((p) => p[1])
      // O flyTo deixa o padding gravado no mapa e o fitBounds somaria o dele por cima:
      // a soma passa da altura da tela e o mapa desiste de enquadrar. Por isso zera antes.
      mapa.current.setPadding({ top: 0, right: 0, bottom: 0, left: 0 })
      mapa.current.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
        { padding: margemDoPainel(caixa.current!), maxZoom: 17, duration: 800 })
    }
  }, [rota]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!foco || !mapa.current) return
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // O padding faz o alvo ficar no meio da parte do mapa que o painel não cobre.
    mapa.current.flyTo({ center: [foco.alvo.lon, foco.alvo.lat], zoom: foco.zoom ?? 15, duration: semMovimento ? 0 : 900,
      padding: margemDoPainel(caixa.current!) })
  }, [foco])

  return (
    <div
      ref={caixa}
      className="mapa-sp"
      role="region"
      aria-label="Mapa das linhas e estações. Use a busca ou a lista de estações perto de você para navegar sem o mapa."
    />
  )
}
