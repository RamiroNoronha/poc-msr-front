import i18n from 'i18next'

// Formatadores que seguem o idioma ativo; evitam fixar um locale (como 'pt-BR') no código.
export function formatNumber(value: number) {
  return new Intl.NumberFormat(i18n.language).format(value)
}

export function formatPercent(ratio: number) {
  return new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0, style: 'percent' }).format(ratio)
}
