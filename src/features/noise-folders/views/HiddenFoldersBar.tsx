import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { HiddenFolder } from '../hooks/useHiddenFolders'
import { Bar, Hint, Item, List, Summary, TextButton } from '../styles/HiddenFoldersBar.styled'

type HiddenFoldersBarProps = {
  folders: HiddenFolder[]
  onRestore: (path: string) => void
  onRestoreAll: () => void
}

export function HiddenFoldersBar({ folders, onRestore, onRestoreAll }: HiddenFoldersBarProps) {
  const { t } = useTranslation('noiseFolders')
  const [isOpen, setIsOpen] = useState(false)

  function describe(folder: HiddenFolder) {
    if (folder.source === 'manual') return t('reasons.manual')
    return folder.reasons
      .map((reason) => {
        if (reason.code === 'name') return t('reasons.name', { category: t(`categories.${reason.category}`), token: reason.token })
        return t(`reasons.${reason.code}`, { count: reason.count })
      })
      .join(' · ')
  }

  return (
    <Bar aria-label={t('bar.title')}>
      <Summary>
        <span>{t('bar.summary', { count: folders.length })}</span>
        {folders.length > 0 ? (
          <TextButton aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)} type="button">
            {isOpen ? t('bar.toggleClose') : t('bar.toggleOpen')}
          </TextButton>
        ) : null}
      </Summary>

      {isOpen && folders.length > 0 ? (
        <>
          <List>
            {folders.map((folder) => (
              <Item key={folder.path}>
                <div>
                  <strong>{folder.path}</strong>
                  <small>{[t('files', { count: folder.files }), describe(folder)].filter(Boolean).join(' · ')}</small>
                </div>
                <TextButton onClick={() => onRestore(folder.path)} type="button">{t('bar.restore')}</TextButton>
              </Item>
            ))}
          </List>
          <Summary>
            <Hint>{t('hint')}</Hint>
            <TextButton onClick={onRestoreAll} type="button">{t('bar.restoreAll')}</TextButton>
          </Summary>
        </>
      ) : null}
    </Bar>
  )
}
