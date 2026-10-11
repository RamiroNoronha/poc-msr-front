const labels: Record<string, string> = {
  first_name_only: 'Só o primeiro nome coincide',
  handle_matches_name: 'Usuário do e-mail igual ao nome',
  handle_similar_to_name: 'Usuário do e-mail parecido com o nome',
  same_email: 'Mesmo e-mail',
  same_email_user: 'Mesmo usuário de e-mail',
  same_github_login: 'Mesmo usuário do GitHub',
  same_name: 'Mesmo nome',
  same_single_name: 'Mesmo nome (uma palavra só)',
  similar_name: 'Nome muito parecido',
}

export function describeReason(reason: string) {
  return labels[reason] ?? reason
}
