/**
 * Estações. O arquivo estacoes.json é GERADO: não edite à mão.
 * Para refazer: `python 30-dados/scripts/gerar_estacoes.py` (na raiz do repositório).
 */
import dados from './estacoes.json'

export type Estacao = {
  /** "<linha>-<nome-sem-acento>", ex.: "1-se". Único por linha. */
  id: string
  nome: string
  linha: number
  lat: number
  lon: number
  /** Outras linhas com estação a menos de 450 m (integração). */
  integracoes: number[]
}

export const ESTACOES: Estacao[] = dados

/** Já vem na ordem da linha, de um terminal ao outro. */
export function estacoesDaLinha(linha: number): Estacao[] {
  return ESTACOES.filter((e) => e.linha === linha)
}

export function estacaoPorId(id: string): Estacao | undefined {
  return ESTACOES.find((e) => e.id === id)
}

/** A estação equivalente em outra linha (para o link de integração). */
export function estacaoNaLinha(origem: Estacao, linha: number): Estacao | undefined {
  return estacoesDaLinha(linha)
    .map((e) => ({ e, d: Math.hypot(e.lat - origem.lat, e.lon - origem.lon) }))
    .sort((a, b) => a.d - b.d)[0]?.e
}

/** Busca sem ligar para acento nem maiúscula: "se" acha "Sé". */
export function semAcento(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Link que abre a rota a pé no app de mapas do celular (Google Maps). */
export function linkComoChegar(e: Estacao): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lon}&travelmode=walking`
}
