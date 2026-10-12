import { useTranslation } from 'react-i18next'
import { Button } from '../styles/ExpandButton.styled'

type ExpandButtonProps = {
  isExpanded: boolean
  onToggle: () => void
}

// Posicionado no canto superior direito do contêiner (que deve ter position: relative).
export function ExpandButton({ isExpanded, onToggle }: ExpandButtonProps) {
  const { t } = useTranslation('common')

  return (
    <Button aria-label={isExpanded ? t('expand.exit') : t('expand.enter')} onClick={onToggle} title={isExpanded ? t('expand.exitTitle') : t('expand.enterTitle')} type="button">
      {isExpanded ? t('expand.exitButton') : t('expand.enterButton')}
    </Button>
  )
}
