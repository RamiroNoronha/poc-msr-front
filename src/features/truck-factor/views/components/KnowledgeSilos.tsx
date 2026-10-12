import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { OTHERS_COLOR } from '../../utils/developerColors'
import { splitPath, type FileInfo } from '../../utils/tree'

const FILES_PER_DEVELOPER = 5
const DEVELOPERS_SHOWN = 8

type KnowledgeSilosProps = {
  colors: Map<string, string>
  onSelectFile: (path: string) => void
  soloFiles: FileInfo[]
  totalFiles: number
}

type Group = { developer: string; files: FileInfo[]; lines: number }

const risk = (file: FileInfo) => Math.max(file.size, 1) * file.revisions

export function KnowledgeSilos({ colors, onSelectFile, soloFiles, totalFiles }: KnowledgeSilosProps) {
  const { t } = useTranslation('truckFactor')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [showAllDevelopers, setShowAllDevelopers] = useState(false)

  const groups = useMemo(() => {
    const byDeveloper = new Map<string, Group>()
    for (const file of soloFiles) {
      const developer = file.authors[0].name
      const group = byDeveloper.get(developer) ?? { developer, files: [], lines: 0 }
      group.files.push(file)
      group.lines += file.size
      byDeveloper.set(developer, group)
    }
    for (const group of byDeveloper.values()) group.files.sort((a, b) => risk(b) - risk(a))
    return [...byDeveloper.values()].sort((a, b) => b.files.length - a.files.length || a.developer.localeCompare(b.developer))
  }, [soloFiles])

  const percentage = totalFiles > 0 ? Math.round((soloFiles.length / totalFiles) * 100) : 0
  const visibleGroups = showAllDevelopers ? groups : groups.slice(0, DEVELOPERS_SHOWN)

  function toggle(developer: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (!next.delete(developer)) next.add(developer)
      return next
    })
  }

  return (
    <Card>
      <header>
        <h2>{t('silos.title')}</h2>
        <p>{t('silos.intro', { count: soloFiles.length, percentage, total: totalFiles })} {t('silos.introDetails')}</p>
      </header>

      {groups.length === 0 ? (
        <Empty>{t('silos.empty')}</Empty>
      ) : (
        <Groups>
          {visibleGroups.map((group) => {
            const isExpanded = expanded.has(group.developer)
            const files = isExpanded ? group.files : group.files.slice(0, FILES_PER_DEVELOPER)
            return (
              <Group key={group.developer}>
                <GroupHeader>
                  <Swatch style={{ background: colors.get(group.developer) ?? OTHERS_COLOR }} />
                  <strong>{group.developer}</strong>
                  <small>{t('silos.groupStats', { files: t('units.files', { count: group.files.length }), lines: t('units.lines', { count: group.lines }) })}</small>
                </GroupHeader>
                <Files>
                  {files.map((file) => {
                    const { directory, name } = splitPath(file.path)
                    return (
                      <li key={file.path}>
                        <FileButton onClick={() => onSelectFile(file.path)} title={file.path} type="button">
                          <span>
                            <strong>{name}</strong>
                            {directory ? <small>{directory}</small> : null}
                          </span>
                          <em>{t('silos.fileStats', { lines: t('units.lines', { count: file.size }), revisions: t('units.revisionsShort', { count: file.revisions }) })}</em>
                        </FileButton>
                      </li>
                    )
                  })}
                </Files>
                {group.files.length > FILES_PER_DEVELOPER ? (
                  <More onClick={() => toggle(group.developer)} type="button">
                    {isExpanded ? t('silos.showLess') : t('silos.showAll', { count: group.files.length })}
                  </More>
                ) : null}
              </Group>
            )
          })}
          {groups.length > DEVELOPERS_SHOWN ? (
            <More onClick={() => setShowAllDevelopers((current) => !current)} type="button">
              {showAllDevelopers ? t('silos.lessDevelopers') : t('silos.moreDevelopers', { count: groups.length - DEVELOPERS_SHOWN })}
            </More>
          ) : null}
        </Groups>
      )}
    </Card>
  )
}

const Card = styled.section`
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);

  h2 { margin: 0; font-size: 1.1rem; }
  header p { margin: 0.4rem 0 0; color: var(--text-muted); font-size: 0.875rem; line-height: 1.5; }
`

const Groups = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 24rem), 1fr));
  gap: 1rem;
  align-items: start;

  > button { grid-column: 1 / -1; justify-self: start; }
`

const Group = styled.article`
  display: grid;
  gap: 0.6rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--surface);
`

const GroupHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;

  strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  small { margin-left: auto; flex: none; color: var(--text-muted); font-size: 0.75rem; }
`

const Swatch = styled.span`
  flex: none;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
`

const Files = styled.ul`
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

const FileButton = styled.button`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.45rem 0.6rem;
  border: 0;
  border-radius: 0.6rem;
  color: var(--text);
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover { background: var(--surface-strong); }

  span { display: grid; min-width: 0; }
  strong, small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  strong { font-size: 0.875rem; font-weight: 600; }
  small { color: var(--text-muted); font-size: 0.75rem; }
  em { flex: none; color: var(--text-muted); font-size: 0.75rem; font-style: normal; }
`

const More = styled.button`
  padding: 0.35rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text);
  background: transparent;
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover { background: var(--surface-strong); }
`

const Empty = styled.p`
  margin: 0;
  color: var(--text-muted);
`
