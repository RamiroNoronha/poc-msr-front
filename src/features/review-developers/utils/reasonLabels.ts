import i18n, { type ParseKeys } from 'i18next'

// Os motivos vêm do backend como códigos (ex.: "same_email"); códigos desconhecidos são exibidos como estão.
export function describeReason(reason: string) {
  const key = `reasons.${reason}`
  return i18n.exists(key, { ns: 'reviewDevelopers' }) ? i18n.t(key as ParseKeys<'reviewDevelopers'>, { ns: 'reviewDevelopers' }) : reason
}
