import 'i18next'
import type { DEFAULT_LANGUAGE, resources } from './app/i18n'

// Tipa as chaves de tradução: chave inexistente ou namespace errado vira erro de compilação.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: (typeof resources)[typeof DEFAULT_LANGUAGE]
    returnNull: false
  }
}
