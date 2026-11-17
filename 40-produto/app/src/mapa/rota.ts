/**
 * Rota a pé até a estação, calculada pelo Valhalla (motor de rotas livre, dados do OpenStreetMap).
 *
 * Servidor público do FOSSGIS: grátis, sem chave, mas com regra de no máximo 1 pedido por
 * segundo e só para sites de pouco tráfego (D-008). Por isso a rota só é pedida quando a
 * pessoa toca no botão, nunca sozinha.
 *
 * "Sem escadas" usa o tipo wheelchair do Valhalla: evita degraus e rampas muito íngremes,
 * conforme o que está mapeado no OpenStreetMap. Mapa pode ter erro: o site avisa isso.
 */
import type { Posicao } from './geo'

const SERVIDOR = 'https://valhalla1.openstreetmap.de/route'

export type TipoRota = 'a-pe' | 'sem-escadas'

export type Rota = {
  tipo: TipoRota
  /** Pontos do caminho, [lon, lat] (formato do MapLibre). */
  caminho: [number, number][]
  metros: number
  segundos: number
  passos: string[]
}

export async function calcularRota(de: Posicao, para: Posicao, tipo: TipoRota, sinal?: AbortSignal): Promise<Rota> {
  const pedido = {
    locations: [
      { lat: de.lat, lon: de.lon },
      { lat: para.lat, lon: para.lon },
    ],
    costing: 'pedestrian',
    costing_options: { pedestrian: tipo === 'sem-escadas' ? { type: 'wheelchair' } : { type: 'foot' } },
    directions_options: { language: 'pt-BR', units: 'kilometers' },
  }
  const resposta = await fetch(SERVIDOR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
    signal: sinal,
  })
  if (!resposta.ok) throw new Error(`Servidor de rotas respondeu ${resposta.status}`)
  const dados = await resposta.json()
  const perna = dados?.trip?.legs?.[0]
  if (!perna) throw new Error('Resposta sem rota')

  return {
    tipo,
    caminho: decodificarPolyline(perna.shape, 6),
    metros: Math.round((dados.trip.summary.length ?? 0) * 1000),
    segundos: Math.round(dados.trip.summary.time ?? 0),
    passos: (perna.maneuvers ?? []).map((m: { instruction: string }) => m.instruction).filter(Boolean),
  }
}

/**
 * O Valhalla manda o caminho compactado no formato "encoded polyline" (precisão 6).
 * Cada número vem como diferença em relação ao ponto anterior, em blocos de 5 bits.
 * Devolve [lon, lat], que é a ordem que o MapLibre usa.
 */
export function decodificarPolyline(codigo: string, precisao = 6): [number, number][] {
  const fator = 10 ** precisao
  const pontos: [number, number][] = []
  let i = 0
  let lat = 0
  let lon = 0
  const proximo = () => {
    let resultado = 0
    let deslocamento = 0
    let byte: number
    do {
      byte = codigo.charCodeAt(i++) - 63
      resultado |= (byte & 0x1f) << deslocamento
      deslocamento += 5
    } while (byte >= 0x20)
    return resultado & 1 ? ~(resultado >> 1) : resultado >> 1
  }
  while (i < codigo.length) {
    lat += proximo()
    lon += proximo()
    pontos.push([lon / fator, lat / fator])
  }
  return pontos
}

export function textoTempo(segundos: number): string {
  const minutos = Math.max(1, Math.round(segundos / 60))
  if (minutos < 60) return `${minutos} min`
  return `${Math.floor(minutos / 60)} h ${minutos % 60} min`
}
