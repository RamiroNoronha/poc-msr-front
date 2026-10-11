import styled from '@emotion/styled'
import { ExpandButton } from '../../../shared/components/ExpandButton'
import { useExpandable } from '../../../shared/hooks/useExpandable'
import { expandedOverlay } from '../../../shared/styles/expandable'
import { countFiles, type FileNode } from '../utils/tree'
import { HotspotChart } from './components/HotspotChart'

export function HotspotSection({ tree }: { tree: FileNode }) {
  const { isExpanded, toggle } = useExpandable()
  const hasFiles = (tree.children?.length ?? 0) > 0 && countFiles(tree) > 0

  return (
    <Section>
      <SectionHeader>
        <h2>Hotspots</h2>
        <p>
          Cada círculo é um arquivo (tamanho = linhas de código). Quanto mais vermelho, mais vezes o arquivo foi alterado no histórico.
          Arquivos grandes e vermelhos são os hotspots: concentram mudanças e tendem a ser mais difíceis de manter.
        </p>
      </SectionHeader>

      {hasFiles ? (
        <Card data-expanded={isExpanded || undefined}>
          <ExpandButton isExpanded={isExpanded} onToggle={toggle} />
          <HotspotChart tree={tree} />
        </Card>
      ) : (
        <Empty>Nenhum arquivo foi encontrado no histórico deste repositório.</Empty>
      )}
    </Section>
  )
}

const Section = styled.section`
  display: grid;
  gap: 1.5rem;
`

const SectionHeader = styled.header`
  h2 { margin: 0; font-size: 1.5rem; letter-spacing: -0.02em; }
  p { max-width: 52rem; margin: 0.5rem 0 0; color: var(--text-muted); line-height: 1.6; }
`

const Card = styled.div`
  position: relative;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);

  &[data-expanded] {
    ${expandedOverlay}
  }
`

const Empty = styled.p`
  padding: 1.5rem;
  border: 1px dashed var(--border);
  border-radius: 1.25rem;
  color: var(--text-muted);
  text-align: center;
`
