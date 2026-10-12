import { useTranslation } from 'react-i18next'
import { ExpandButton } from '../../../shared/components/ExpandButton'
import { useExpandable } from '../../../shared/hooks/useExpandable'
import { countFiles, type FileNode } from '../utils/tree'
import { HotspotChart } from './components/HotspotChart'
import { Card, Empty, Section, SectionHeader } from '../styles/HotspotSection.styled'

export function HotspotSection({ tree }: { tree: FileNode }) {
  const { t } = useTranslation('hotspot')
  const { t: tCommon } = useTranslation('common')
  const { isExpanded, toggle } = useExpandable()
  const hasFiles = (tree.children?.length ?? 0) > 0 && countFiles(tree) > 0

  return (
    <Section>
      <SectionHeader>
        <h2>{t('section.title')}</h2>
        <p>{t('section.description')}</p>
      </SectionHeader>

      {hasFiles ? (
        <Card data-expanded={isExpanded || undefined}>
          <ExpandButton isExpanded={isExpanded} onToggle={toggle} />
          <HotspotChart tree={tree} />
        </Card>
      ) : (
        <Empty>{tCommon('noFiles')}</Empty>
      )}
    </Section>
  )
}
