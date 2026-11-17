import { ESTACOES, type Estacao } from '../data/estacoes'

export type Posicao = { lat: number; lon: number }

/** Distância em metros entre dois pontos (fórmula de haversine). */
export function distanciaM(a: Posicao, b: Posicao): number {
  const R = 6371000
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * As estações mais perto, uma por nome (a Sé da Linha 1 e da Linha 3 contam como uma),
 * com todas as linhas daquele lugar. A distância é em linha reta: a rota de verdade
 * só aparece quando a pessoa pede.
 */
export function maisProximas(de: Posicao, quantas = 5): { estacao: Estacao; linhas: number[]; metros: number }[] {
  const porNome = new Map<string, { estacao: Estacao; linhas: number[]; metros: number }>()
  for (const e of ESTACOES) {
    const metros = distanciaM(de, e)
    const atual = porNome.get(e.nome)
    if (!atual) porNome.set(e.nome, { estacao: e, linhas: [e.linha], metros })
    else {
      atual.linhas.push(e.linha)
      if (metros < atual.metros) Object.assign(atual, { estacao: e, metros })
    }
  }
  return [...porNome.values()].sort((a, b) => a.metros - b.metros).slice(0, quantas)
}

export function textoDistancia(metros: number): string {
  // Arredonda antes de comparar: 996 m vira 1000 m, que tem que aparecer como "1,0 km".
  const arredondado = Math.round(metros / 10) * 10
  if (arredondado < 1000) return `${arredondado} m`
  return `${(metros / 1000).toFixed(1).replace('.', ',')} km`
}
