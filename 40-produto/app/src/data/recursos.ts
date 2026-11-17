import type { NomeIcone } from '../components/Icone'

/**
 * Recursos de acessibilidade que o site acompanha em cada estação, e o texto do guia.
 * Regra: o que é instrução prática tem fonte (link em `fonte`). O que é só definição do
 * recurso (o que é um piso tátil) não precisa.
 */
export type Recurso = {
  chave: NomeIcone
  nome: string
  oQueE: string
  comoUsar: string[]
}

export const RECURSOS: Recurso[] = [
  {
    chave: 'elevador',
    nome: 'Elevador',
    oQueE: 'Liga a rua, o mezanino (onde ficam as catracas) e a plataforma sem precisar de escada.',
    comoUsar: [
      'Antes de sair, veja na página da estação se o grupo já testou o elevador e quando.',
      'Elevador parado ou não achou? Peça ajuda a um funcionário: as equipes acompanham passageiros com deficiência ou mobilidade reduzida no deslocamento dentro da estação.',
    ],
  },
  {
    chave: 'banheiro',
    nome: 'Banheiro acessível',
    oQueE: 'Banheiro com porta larga, espaço para girar a cadeira de rodas e barras de apoio.',
    comoUsar: [
      'Se não encontrar o banheiro ou ele estiver fechado, peça ajuda a um funcionário.',
    ],
  },
  {
    chave: 'rampa',
    nome: 'Rampa e acesso sem degrau',
    oQueE: 'Caminho da calçada até o trem sem degraus, com rampas onde há desnível.',
    comoUsar: [
      'No Metrô, quem usa cadeira de rodas ou tem deficiência visual pode pedir apoio no embarque e no desembarque: as equipes acompanham e monitoram o trajeto.',
      'Peça ajuda já na entrada da estação e diga onde vai descer: a estação de destino é avisada para receber você.',
      'Se o vão entre o trem e a plataforma for grande, espere o funcionário antes de embarcar.',
    ],
  },
  {
    chave: 'tatil',
    nome: 'Piso tátil',
    oQueE: 'Faixas em relevo no chão. As de linhas retas (direcionais) mostram o caminho; as de bolinhas (alerta) avisam perigo, como a beira da plataforma.',
    comoUsar: [
      'Siga as faixas direcionais até a plataforma e pare na faixa de alerta.',
      'Não deixe malas ou carrinhos em cima do piso tátil: ele precisa estar livre.',
    ],
  },
  {
    chave: 'sonoro',
    nome: 'Avisos sonoros e Braille',
    oQueE: 'Anúncios em áudio das estações e placas com escrita em Braille em corrimãos, elevadores e mapas táteis.',
    comoUsar: [
      'Em caso de dúvida, peça ajuda: o Metrô garante atendimento preferencial em todas as bilheterias.',
    ],
  },
]

/** Fontes das instruções práticas do guia (mostradas no fim da página do guia). */
export const FONTES_GUIA = [
  {
    texto: 'Apoio no embarque e desembarque para pessoas com deficiência visual e cadeirantes (Diário do Transporte, 21/09/2026)',
    url: 'https://diariodotransporte.com.br/2026/09/21/dia-nacional-de-luta-da-pessoa-com-deficiencia-transportes-metropolitanos-capacitam-colaboradores-para-atender-passageiros-pcds/',
  },
  {
    texto: 'Protocolo de receber o passageiro na estação de destino (Diário do Transporte, 02/09/2022)',
    url: 'https://diariodotransporte.com.br/2022/09/02/metro-admite-falha-e-diz-que-puniu-funcionario-em-caso-de-passageira-cega-que-caiu-nos-trilhos/amp/',
  },
  {
    texto: 'Piso tátil direcional e de alerta nas plataformas (Diário do Transporte, 30/01/2019)',
    url: 'https://diariodotransporte.com.br/2019/01/30/apos-tac-com-ministerio-publico-cptm-conclui-obras-de-acessibilidade-na-estacao-mogi-das-cruzes/',
  },
  {
    texto: 'Atendimento preferencial em todas as bilheterias e acompanhamento no embarque, desembarque e deslocamento na estação (Metrô SP, apresentação na ALAMYS)',
    url: 'https://alamys.org/wp-content/files_mf/14532093162_op_terceraedad.pdf',
  },
  {
    texto: 'Carta de Serviços do Metrô: Central de Informações 0800 770 7722, das 5h à meia-noite',
    url: 'https://transparencia.metrosp.com.br/node/4762/download',
  },
]

/** Postos de Atendimento à Pessoa com Deficiência (fonte: primeira de FONTES_GUIA). */
export const POSTOS_PCD = ['Palmeiras-Barra Funda', 'Tatuapé']
