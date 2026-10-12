import { useTranslation } from 'react-i18next'
import { List } from '../../styles/ExampleRepositories.styled'

const EXAMPLES = ['facebook/react', 'vuejs/core', 'pallets/flask']

type ExampleRepositoriesProps = {
  disabled: boolean
  onSelect: (url: string) => void
}

export function ExampleRepositories({ disabled, onSelect }: ExampleRepositoriesProps) {
  const { t } = useTranslation('analyzeRepository')

  return (
    <List>
      <span>{t('examples.label')}</span>
      {EXAMPLES.map((example) => (
        <button disabled={disabled} key={example} onClick={() => onSelect(`https://github.com/${example}`)} type="button">{example}</button>
      ))}
    </List>
  )
}
