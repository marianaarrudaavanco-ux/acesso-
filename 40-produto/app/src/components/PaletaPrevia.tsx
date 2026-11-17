import { useEffect, useState } from 'react'

/**
 * Seletor de paleta, só para a prévia: aparece quando o endereço tem ?paletas
 * (ex.: https://site/?paletas). Paleta é decisão de marca: o grupo compara as três e escolhe.
 * Depois da escolha, a paleta vencedora vira a padrão em index.css e este componente sai.
 */
export const PALETAS = [
  { id: 'piso', nome: 'Piso tátil', descricao: 'Preto e amarelo do piso tátil' },
  { id: 'placa', nome: 'Placa', descricao: 'Azul-marinho das placas e ciano' },
  { id: 'sinal', nome: 'Sinal', descricao: 'Grafite e laranja de sinalização' },
] as const

const CHAVE = 'accessmetro-paleta'

function lerSalva(): string | null {
  try { return localStorage.getItem(CHAVE) } catch { return null }
}

export default function PaletaPrevia() {
  const ligado = new URLSearchParams(window.location.search).has('paletas') || lerSalva() !== null
  const [paleta, setPaleta] = useState<string>(() => lerSalva() ?? 'piso')

  useEffect(() => {
    if (!ligado) return
    document.documentElement.dataset.paleta = paleta
    try { localStorage.setItem(CHAVE, paleta) } catch { /* sem armazenamento: só não lembra */ }
  }, [paleta, ligado])

  if (!ligado) return null
  return (
    <div className="paleta-previa" role="group" aria-label="Prévia: escolher paleta de cores">
      <span className="paleta-previa__rotulo">Paleta</span>
      {PALETAS.map((p) => (
        <button key={p.id} type="button" aria-pressed={paleta === p.id} title={p.descricao} onClick={() => setPaleta(p.id)}>
          <span className={`paleta-previa__amostra paleta-previa__amostra--${p.id}`} aria-hidden="true" />
          {p.nome}
        </button>
      ))}
    </div>
  )
}
