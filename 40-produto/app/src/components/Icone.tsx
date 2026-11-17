/**
 * Ícones desenhados em SVG (no lugar de emoji, que muda de cara em cada celular).
 * São decorativos: o texto ao lado sempre diz o que é, por isso aria-hidden.
 */
export type NomeIcone = 'elevador' | 'banheiro' | 'rampa' | 'tatil' | 'sonoro'

export default function Icone({ nome, tamanho = 28 }: { nome: NomeIcone; tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="icone"
    >
      {nome === 'elevador' && (
        <>
          <rect x="4" y="2.5" width="16" height="19" />
          <path d="M8.5 9.5 11 6.5l2.5 3M8.5 14.5l2.5 3 2.5-3" />
          <path d="M16.5 6v12" />
        </>
      )}
      {nome === 'banheiro' && (
        <>
          <rect x="3" y="2.5" width="18" height="19" />
          <circle cx="12" cy="7" r="1.6" fill="currentColor" stroke="none" />
          <path d="M12 9.5v4.5h3l1.5 3.5" />
          <path d="M9.5 12.5a4 4 0 1 0 5.6 4.6" />
        </>
      )}
      {nome === 'rampa' && (
        <>
          <path d="M2.5 20.5h19L21.5 9z" />
          <circle cx="9" cy="6" r="1.5" fill="currentColor" stroke="none" />
          <path d="M9 8.5v3.5h3" />
          <path d="M7 11.2a3.3 3.3 0 1 0 4.6 3.5" />
        </>
      )}
      {nome === 'tatil' && (
        <g fill="currentColor" stroke="none">
          {[5, 12, 19].flatMap((x) => [5, 12, 19].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" />))}
        </g>
      )}
      {nome === 'sonoro' && (
        <>
          <path d="M3.5 9.5h4l5-4v13l-5-4h-4z" />
          <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
        </>
      )}
    </svg>
  )
}
