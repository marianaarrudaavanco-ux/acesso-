/**
 * Linhas de metrô e trem de São Paulo.
 *
 * Fonte dos fatos: `30-dados/linhas.md` (lá estão os links).
 * Se algo mudar, mude primeiro lá e depois aqui.
 */

export type Linha = {
  numero: number
  nome: string
  tipo: 'metro' | 'trem'
  /** null = ainda não confirmamos quem opera hoje */
  operadora: string | null
  /** Cor de fundo do selo da linha. */
  cor: string
  /** false = cor aproximada, sem fonte oficial ainda */
  corOficial: boolean
  /** Aviso fixo sobre a operação da linha, com fonte em 30-dados/linhas.md */
  aviso?: string
}

export const LINHAS: Linha[] = [
  // Cores do Metrô: pacote metrosp (github.com/viniciusoike/metrosp), "official METRO SP branding".
  { numero: 1, nome: 'Azul', tipo: 'metro', operadora: 'Metrô', cor: '#171796', corOficial: true },
  { numero: 2, nome: 'Verde', tipo: 'metro', operadora: 'Metrô', cor: '#007A5E', corOficial: true },
  { numero: 3, nome: 'Vermelha', tipo: 'metro', operadora: 'Metrô', cor: '#ED2E38', corOficial: true },
  { numero: 4, nome: 'Amarela', tipo: 'metro', operadora: 'Motiva Linha 4 (antiga ViaQuatro)', cor: '#FFD525', corOficial: true },
  { numero: 5, nome: 'Lilás', tipo: 'metro', operadora: 'Motiva Linhas 5 e 17 (antiga ViaMobilidade)', cor: '#874ABF', corOficial: true },
  { numero: 15, nome: 'Prata', tipo: 'metro', operadora: 'Metrô', cor: '#8F8F8C', corOficial: true },
  {
    numero: 17, nome: 'Ouro', tipo: 'metro', operadora: 'Motiva Linhas 5 e 17 (antiga ViaMobilidade)', cor: '#B8913A', corOficial: false,
    aviso: 'Operação transitória: das 6h às 22h, de segunda a sábado.',
  },
  // Trens: cores aproximadas, sem fonte oficial ainda.
  { numero: 7, nome: 'Rubi', tipo: 'trem', operadora: 'TIC Trens', cor: '#B0124F', corOficial: false },
  { numero: 8, nome: 'Diamante', tipo: 'trem', operadora: 'ViaMobilidade (Motiva)', cor: '#8E928A', corOficial: false },
  { numero: 9, nome: 'Esmeralda', tipo: 'trem', operadora: 'ViaMobilidade (Motiva)', cor: '#00A19A', corOficial: false },
  { numero: 10, nome: 'Turquesa', tipo: 'trem', operadora: 'CPTM', cor: '#0091B8', corOficial: false },
  {
    numero: 11, nome: 'Coral', tipo: 'trem', operadora: 'Trivia Trens', cor: '#F0643C', corOficial: false,
    aviso: 'Em transição: a Trivia Trens opera com supervisão da CPTM até 25/11/2026.',
  },
  {
    numero: 12, nome: 'Safira', tipo: 'trem', operadora: 'Trivia Trens', cor: '#163E8C', corOficial: false,
    aviso: 'Em transição: a Trivia Trens opera com supervisão da CPTM até 25/11/2026.',
  },
  { numero: 13, nome: 'Jade', tipo: 'trem', operadora: 'Trivia Trens', cor: '#00A651', corOficial: false },
]

export function linhaPorNumero(numero: number): Linha | undefined {
  return LINHAS.find((l) => l.numero === numero)
}

/**
 * Cor do texto em cima do selo: preto ou branco, o que der mais contraste.
 * Assim a Linha 4 (amarela) fica com texto preto e a Linha 1 (azul) com branco,
 * sem ninguém precisar escolher na mão.
 */
export function corDoTexto(fundo: string): '#000000' | '#FFFFFF' {
  const canal = (i: number) => {
    const c = parseInt(fundo.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const luz = 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5)
  const contrasteComBranco = 1.05 / (luz + 0.05)
  const contrasteComPreto = (luz + 0.05) / 0.05
  return contrasteComPreto >= contrasteComBranco ? '#000000' : '#FFFFFF'
}
