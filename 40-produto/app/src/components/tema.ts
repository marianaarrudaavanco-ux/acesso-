/**
 * Modo claro / escuro (D-012).
 * Sem escolha salva, segue o celular (prefers-color-scheme). Tocando no botão, a escolha fica
 * salva no navegador. O index.html aplica o tema antes do React carregar, para a tela não piscar branca.
 */
import { useSyncExternalStore } from 'react'

export type Tema = 'claro' | 'escuro'
const CHAVE = 'accessmetro:tema'
const EVENTO = 'accessmetro:tema'
const COR_BARRA = { claro: '#14161a', escuro: '#0a0b0d' }

function salvo(): Tema | null {
  try { const t = localStorage.getItem(CHAVE); return t === 'claro' || t === 'escuro' ? t : null } catch { return null }
}
const doSistema = (): Tema => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro')

function aplicar(t: Tema) {
  document.documentElement.dataset.tema = t
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COR_BARRA[t])
  window.dispatchEvent(new Event(EVENTO))
}

export function trocarTema() {
  const novo: Tema = temaAtual() === 'escuro' ? 'claro' : 'escuro'
  try { localStorage.setItem(CHAVE, novo) } catch { /* sem armazenamento: vale só nesta visita */ }
  aplicar(novo)
}

const temaAtual = (): Tema => (document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro')

function assinar(avisar: () => void) {
  // Sem escolha salva, acompanha quando o celular troca sozinho (ex.: escuro à noite).
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const doCelular = () => { if (!salvo()) aplicar(doSistema()) }
  mq.addEventListener('change', doCelular)
  window.addEventListener(EVENTO, avisar)
  return () => { mq.removeEventListener('change', doCelular); window.removeEventListener(EVENTO, avisar) }
}

/** O tema atual, e re-renderiza quando ele muda (o mapa usa para trocar o fundo). */
export function useTema(): Tema {
  return useSyncExternalStore(assinar, temaAtual)
}
