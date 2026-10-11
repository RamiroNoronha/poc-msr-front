import { ZoomableCirclePack } from '../../../../shared/components/ZoomableCirclePack'
import type { FileOwnership } from '../../utils/ownership'
import type { FileNode } from '../../utils/tree'

const NEUTRAL = '#3b4766'
const HINT = 'Clique em um círculo para dar zoom e clique fora dele para voltar. Quanto maior o círculo, mais linhas o arquivo tem.'
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

function describeCollaborators(collaborators: string[]) {
  const shown = collaborators.slice(0, MAX_LISTED_COLLABORATORS).join(', ')
  const rest = collaborators.length - MAX_LISTED_COLLABORATORS
  const label = collaborators.length === 1 ? 'Colaborador' : `Colaboradores (${collaborators.length})`
  return `${label}: ${shown}${rest > 0 ? ` e mais ${rest}` : ''}`
}

export function OwnershipCircles({ dimUncolored, fileColors, focusPath, onFocusChange, ownership, tree }: OwnershipCirclesProps) {
  return (
    <ZoomableCirclePack
      describeLeaf={({ node, path }) => {
        const collaborators = ownership.get(path)?.collaborators ?? []
        return (
          <>
            <span>{(node.revisions ?? 0).toLocaleString('pt-BR')} revisões</span>
            {collaborators.length > 0 ? <span>{describeCollaborators(collaborators)}</span> : null}
          </>
        )
      }}
      focusPath={focusPath}
      getLeafAppearance={(path) => {
        const color = fileColors.get(path)
        return color ? { color } : { color: NEUTRAL, opacity: dimUncolored ? 0.22 : 0.85 }
      }}
      getValue={getLines}
      hint={HINT}
      onFocusChange={onFocusChange}
      tree={tree}
      valueUnit="linhas"
    />
  )
}
