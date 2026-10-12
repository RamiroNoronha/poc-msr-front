import { useTranslation } from 'react-i18next'
import { ZoomableCirclePack } from '../../../../shared/components/ZoomableCirclePack'
import type { FileOwnership } from '../../utils/ownership'
import type { FileNode } from '../../utils/tree'

const NEUTRAL = '#3b4766'
const MAX_LISTED_COLLABORATORS = 6

type OwnershipCirclesProps = {
  dimUncolored: boolean
  fileColors: Map<string, string>
  focusPath: string
  onFocusChange: (path: string) => void
  ownership: Map<string, FileOwnership>
  tree: FileNode
}

const getLines = (file: FileNode) => file.size ?? 0

export function OwnershipCircles({ dimUncolored, fileColors, focusPath, onFocusChange, ownership, tree }: OwnershipCirclesProps) {
  const { t } = useTranslation('truckFactor')

  function describeCollaborators(collaborators: string[]) {
    const listed = collaborators.slice(0, MAX_LISTED_COLLABORATORS).join(', ')
    const rest = collaborators.length - MAX_LISTED_COLLABORATORS
    return t('chart.collaborators', { count: collaborators.length, names: rest > 0 ? t('chart.andMore', { count: rest, names: listed }) : listed })
  }

  return (
    <ZoomableCirclePack
      describeLeaf={({ node, path }) => {
        const collaborators = ownership.get(path)?.collaborators ?? []
        return (
          <>
            <span>{t('units.revisions', { count: node.revisions ?? 0 })}</span>
            {collaborators.length > 0 ? <span>{describeCollaborators(collaborators)}</span> : null}
          </>
        )
      }}
      focusPath={focusPath}
      formatValue={(value) => t('units.lines', { count: value })}
      getLeafAppearance={(path) => {
        const color = fileColors.get(path)
        return color ? { color } : { color: NEUTRAL, opacity: dimUncolored ? 0.22 : 0.85 }
      }}
      getValue={getLines}
      hint={t('chart.hint')}
      onFocusChange={onFocusChange}
      tree={tree}
    />
  )
}
