/**
 * Lê a tabela de testes em campo (vistorias.md) e organiza por estação.
 *
 * Por que markdown e não JSON: o grupo preenche pelo site do GitHub, sem instalar nada.
 * Tabela é fácil de editar e de ler; JSON quebra com uma vírgula fora do lugar.
 * O `?raw` faz o Vite entregar o arquivo como texto, e a gente lê linha por linha.
 */
import texto from './vistorias.md?raw'
import type { NomeIcone } from '../components/Icone'
import { ESTACOES, semAcento } from './estacoes'

export type Resultado = 'funciona' | 'nao-funciona' | 'nao-tem'

export type Vistoria = {
  data: string // AAAA-MM-DD
  estacaoId: string
  recurso: NomeIcone
  resultado: Resultado
  quem: string
  observacao: string
}

const RECURSO: Record<string, NomeIcone> = {
  elevador: 'elevador', banheiro: 'banheiro', rampa: 'rampa',
  'piso tatil': 'tatil', tatil: 'tatil', sonoro: 'sonoro', 'avisos sonoros': 'sonoro', braille: 'sonoro',
}
const RESULTADO: Record<string, Resultado> = {
  funciona: 'funciona', 'nao funciona': 'nao-funciona', quebrado: 'nao-funciona', 'nao tem': 'nao-tem',
}

function ler(md: string): { vistorias: Vistoria[]; problemas: string[] } {
  const vistorias: Vistoria[] = []
  const problemas: string[] = []
  const linhas = md.split('\n').filter((l) => l.trim().startsWith('|'))
  // As duas primeiras são o cabeçalho e a linha de |---|.
  for (const linha of linhas.slice(2)) {
    const [data, estacao, numero, recurso, resultado, quem = '', observacao = ''] = linha
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())
    const e = ESTACOES.find((x) => x.linha === Number(numero) && semAcento(x.nome) === semAcento(estacao ?? ''))
    const r = RECURSO[semAcento(recurso ?? '')]
    const res = RESULTADO[semAcento(resultado ?? '')]
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data ?? '') || !e || !r || !res) {
      problemas.push(linha.trim())
      continue
    }
    vistorias.push({ data, estacaoId: e.id, recurso: r, resultado: res, quem, observacao })
  }
  return { vistorias, problemas }
}

const { vistorias: VISTORIAS, problemas } = ler(texto)

// Linha mal preenchida não quebra o site: só fica de fora, com aviso para quem estiver rodando local.
if (problemas.length > 0) {
  console.warn('vistorias.md: linhas ignoradas por estarem mal preenchidas:', problemas)
}

export { VISTORIAS }

/** O teste mais recente de cada recurso naquela estação. */
export function ultimaVistoria(estacaoId: string, recurso: NomeIcone): Vistoria | undefined {
  return VISTORIAS.filter((v) => v.estacaoId === estacaoId && v.recurso === recurso)
    .sort((a, b) => b.data.localeCompare(a.data))[0]
}

export function estacoesTestadas(): number {
  return new Set(VISTORIAS.map((v) => v.estacaoId)).size
}

export const TEXTO_RESULTADO: Record<Resultado, string> = {
  funciona: 'Funciona',
  'nao-funciona': 'Não funciona',
  'nao-tem': 'Não tem',
}

export function dataCurta(iso: string): string {
  const [, mes, dia] = iso.split('-')
  return `${dia}/${mes}`
}
