import { corDoTexto, linhaPorNumero } from '../data/linhas'

type Props = {
  numero: number
  tamanho?: 'pequeno' | 'normal' | 'grande'
}

/**
 * O quadrado com o número da linha, como nas placas das estações.
 * O leitor de tela lê "Linha 4-Amarela" em vez de só "4".
 */
export default function SeloLinha({ numero, tamanho = 'normal' }: Props) {
  const linha = linhaPorNumero(numero)
  if (!linha) return null
  return (
    <span
      className={`selo selo--${tamanho}`}
      style={{ background: linha.cor, color: corDoTexto(linha.cor) }}
      role="img"
      aria-label={`Linha ${linha.numero}-${linha.nome}`}
    >
      {linha.numero}
    </span>
  )
}
