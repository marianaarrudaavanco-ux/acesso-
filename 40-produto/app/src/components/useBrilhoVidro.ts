import { useEffect, useRef } from 'react'

/**
 * O brilho do vidro líquido segue o mouse (receita da skill front-design-supremo).
 * Só liga em aparelho com mouse de verdade (hover: hover) e sem "reduzir movimento":
 * no celular e para quem pediu menos movimento, o vidro fica parado.
 */
export function useBrilhoVidro<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const temMouse = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches
    if (!temMouse) return
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
      el.classList.add('hover')
    }
    const sair = () => {
      el.classList.remove('hover')
      el.style.removeProperty('--mx')
    }
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerleave', sair)
    return () => {
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerleave', sair)
    }
  }, [])
  return ref
}
