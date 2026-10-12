import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

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

const Button = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: var(--surface-strong);
  font-size: 0.8125rem;
  cursor: pointer;
  backdrop-filter: blur(8px);

  &:hover { border-color: rgba(124, 92, 255, 0.6); }
`
