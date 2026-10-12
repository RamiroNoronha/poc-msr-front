import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import analyzeRepository from '../features/analyze-repository/locales/pt-BR'
import coupling from '../features/coupling/locales/pt-BR'
import hotspot from '../features/hotspot/locales/pt-BR'
import reviewDevelopers from '../features/review-developers/locales/pt-BR'
import truckFactor from '../features/truck-factor/locales/pt-BR'
import common from '../shared/locales/pt-BR'

// Cada feature é dona do seu namespace de textos (features/<feature>/locales); o `common` é do shared.
// Para adicionar um idioma, crie o mesmo arquivo (ex.: en.ts) em cada locales/ e registre-o em `resources`.
export const DEFAULT_LANGUAGE = 'pt-BR'

export const resources = {
  [DEFAULT_LANGUAGE]: { analyzeRepository, common, coupling, hotspot, reviewDevelopers, truckFactor },
} as const

void i18n.use(initReactI18next).init({
  defaultNS: 'common',
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  lng: DEFAULT_LANGUAGE,
  ns: Object.keys(resources[DEFAULT_LANGUAGE]),
  resources,
  returnNull: false,
})

document.documentElement.lang = i18n.language
document.title = i18n.t('app.title')
