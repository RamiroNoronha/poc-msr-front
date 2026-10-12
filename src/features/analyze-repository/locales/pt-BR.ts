export default {
  badge: 'Mining Software Repositories',
  brand: 'POC-MSR',
  details: {
    button: 'Clique aqui para ver mais detalhes →',
  },
  errors: {
    fallback: 'Não foi possível analisar o repositório.',
    invalidRepositoryUrl: 'A URL do repositório GitHub é inválida.',
    invalidUrl: 'Informe uma URL válida de um repositório público do GitHub.',
    notFound: 'Repositório não encontrado. Confira a URL e se ele é público.',
    offline: 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
  },
  examples: {
    label: 'Experimente:',
  },
  features: {
    authorship: {
      text: 'Quem domina cada parte do código, extraído direto do histórico Git.',
      title: 'Autoria',
    },
    hotspots: {
      text: 'Arquivos com mais revisões e maior concentração de mudanças no histórico.',
      title: 'Hotspots',
    },
    truckFactor: {
      text: 'Quantas pessoas precisam sair para o projeto perder o conhecimento crítico.',
      title: 'Truck Factor',
    },
  },
  form: {
    analyze: 'Analisar',
    analyzing: 'Analisando…',
    label: 'URL do repositório GitHub',
    placeholder: 'https://github.com/owner/repository',
  },
  hero: {
    description: 'Cole a URL de um repositório do GitHub e veja Truck Factor, hotspots e concentração de autoria em segundos.',
    title: 'Descubra o <em>risco de conhecimento</em> do seu repositório.',
  },
  summary: {
    criticalPeople: 'Pessoas críticas',
    filesAnalyzed: 'Arquivos analisados',
    label: 'Resumo da análise',
    truckFactor: 'Truck Factor',
  },
} as const
