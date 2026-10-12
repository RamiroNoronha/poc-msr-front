export default {
  chart: {
    hint: 'Clique em um círculo para dar zoom e clique fora dele para voltar. Círculos grandes e vermelhos são os hotspots.',
    legendLow: 'Poucas mudanças',
    legendHigh: 'Muitas mudanças',
  },
  section: {
    description: 'Cada círculo é um arquivo (tamanho = linhas de código). Quanto mais vermelho, mais vezes o arquivo foi alterado no histórico. Arquivos grandes e vermelhos são os hotspots: concentram mudanças e tendem a ser mais difíceis de manter.',
    title: 'Hotspots',
  },
  units: {
    lines_one: '{{count, number}} linha',
    lines_zero: '0 linhas',
    lines_other: '{{count, number}} linhas',
    revisions_one: '{{count, number}} revisão',
    revisions_zero: '0 revisões',
    revisions_other: '{{count, number}} revisões',
  },
} as const
