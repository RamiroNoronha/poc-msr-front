export type NoiseTree = {
  children?: NoiseTree[]
  name: string
  revisions?: number
}

export type NoiseCategory = 'build' | 'docs' | 'fixtures' | 'generated' | 'tests' | 'vendor'

export type NoiseReason =
  | { code: 'name'; category: NoiseCategory; token: string }
  | { code: 'similarNames'; count: number }
  | { code: 'writtenOnce'; count: number }

export type NoiseConfidence = 'high' | 'medium'

export type FolderScan = {
  confidence: NoiseConfidence | null
  files: number
  path: string
  reasons: NoiseReason[]
}

// Palavras fortes bastam para esconder a pasta; as fracas só sugerem (podem ser código que importa).
const STRONG_TOKENS: Record<string, NoiseCategory> = {
  bin: 'build', build: 'build', coverage: 'build', dist: 'build', out: 'build', target: 'build',
  fixture: 'fixtures', fixtures: 'fixtures', snapshot: 'fixtures', snapshots: 'fixtures', testdata: 'fixtures',
  gen: 'generated', generated: 'generated',
  bower: 'vendor', node: 'vendor', packages_cache: 'vendor', third: 'vendor', thirdparty: 'vendor', vendor: 'vendor', vendors: 'vendor',
}
const SOFT_TOKENS: Record<string, NoiseCategory> = {
  doc: 'docs', docs: 'docs', example: 'docs', examples: 'docs', sample: 'docs', samples: 'docs',
  e2e: 'tests', mock: 'tests', mocks: 'tests', spec: 'tests', specs: 'tests', test: 'tests', tests: 'tests',
}

const STRONG_SCORE = 0.7
const SOFT_SCORE = 0.4
const HOMOGENEOUS_SCORE = 0.3
const WRITTEN_ONCE_SCORE = 0.2
const HIGH_THRESHOLD = 0.7
const MEDIUM_THRESHOLD = 0.4
// Abaixo disso não há amostra para falar em padrão estrutural.
const MIN_FILES_FOR_STRUCTURE = 20
const HOMOGENEOUS_RATIO = 0.9
const MAX_DISTINCT_PATTERN_RATIO = 0.2
const WRITTEN_ONCE_RATIO = 0.8
// Uma pasta que concentra quase o repositório inteiro é o projeto, não ruído.
const MAX_REPOSITORY_SHARE = 0.6

type FileEntry = { extension: string; pattern: string; revisions: number }

export function tokenize(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

type NameMatch = { reason: NoiseReason; strong: boolean }

function matchName(name: string): NameMatch | null {
  const tokens = tokenize(name)
  // `node_modules` vira ["node", "modules"]: "node" sozinho não é ruído.
  if (tokens.includes('node') && tokens.includes('modules')) return { reason: { category: 'vendor', code: 'name', token: name }, strong: true }
  // `third-party`/`third_party` também é um nome composto de código de terceiros.
  if (tokens.length === 2 && tokens[0] === 'third' && tokens[1] === 'party') return { reason: { category: 'vendor', code: 'name', token: name }, strong: true }

  // Nome forte só conta quando é o nome inteiro da pasta (`build`, `dist`, `__snapshots__`). Dentro de um
  // nome composto ele costuma ser verbo ou prefixo de código (`buildMiddleware`, `buildFormatLocale`).
  if (tokens.length === 1 && tokens[0] !== 'node' && STRONG_TOKENS[tokens[0]]) {
    return { reason: { category: STRONG_TOKENS[tokens[0]], code: 'name', token: tokens[0] }, strong: true }
  }
  for (const token of tokens) {
    if (SOFT_TOKENS[token]) return { reason: { category: SOFT_TOKENS[token], code: 'name', token }, strong: false }
  }
  return null
}

function describeFile(node: NoiseTree): FileEntry {
  const dot = node.name.lastIndexOf('.')
  return {
    extension: dot > 0 ? node.name.slice(dot + 1).toLowerCase() : '',
    pattern: node.name.replace(/\d+/g, '#'),
    revisions: node.revisions ?? 0,
  }
}

function structuralReasons(files: FileEntry[]): { reasons: NoiseReason[]; score: number } {
  if (files.length < MIN_FILES_FOR_STRUCTURE) return { reasons: [], score: 0 }

  const reasons: NoiseReason[] = []
  let score = 0

  const extensions = new Map<string, number>()
  const patterns = new Set<string>()
  let writtenOnce = 0
  for (const file of files) {
    extensions.set(file.extension, (extensions.get(file.extension) ?? 0) + 1)
    patterns.add(file.pattern)
    if (file.revisions <= 1) writtenOnce += 1
  }

  const dominant = Math.max(...extensions.values())
  if (dominant / files.length >= HOMOGENEOUS_RATIO && patterns.size / files.length <= MAX_DISTINCT_PATTERN_RATIO) {
    reasons.push({ code: 'similarNames', count: files.length })
    score += HOMOGENEOUS_SCORE
  }
  if (writtenOnce / files.length >= WRITTEN_ONCE_RATIO) {
    reasons.push({ code: 'writtenOnce', count: writtenOnce })
    score += WRITTEN_ONCE_SCORE
  }

  return { reasons, score }
}

function scoreFolder(name: string, files: FileEntry[]): Pick<FolderScan, 'confidence' | 'reasons'> {
  const nameMatch = matchName(name)
  const structure = structuralReasons(files)
  const score = (nameMatch ? (nameMatch.strong ? STRONG_SCORE : SOFT_SCORE) : 0) + structure.score
  const reasons = nameMatch ? [nameMatch.reason, ...structure.reasons] : structure.reasons

  if (score >= HIGH_THRESHOLD) return { confidence: 'high', reasons }
  if (score >= MEDIUM_THRESHOLD) return { confidence: 'medium', reasons }
  return { confidence: null, reasons: [] }
}

// Examina todas as pastas (exceto a raiz); `path` não inclui o nome da raiz, como nos demais utilitários.
export function scanFolders(root: NoiseTree): FolderScan[] {
  const scans: (FolderScan & { name: string; entries: FileEntry[] })[] = []

  function visit(node: NoiseTree, names: string[]): FileEntry[] {
    if (!node.children) return [describeFile(node)]

    const entries = node.children.flatMap((child) => visit(child, [...names, child.name]))
    if (names.length > 0) scans.push({ confidence: null, entries, files: entries.length, name: node.name, path: names.join('/'), reasons: [] })
    return entries
  }

  const total = visit(root, []).length
  return scans.map(({ entries, name, ...scan }) => {
    const isWholeProject = total > 0 && scan.files / total > MAX_REPOSITORY_SHARE
    return isWholeProject ? scan : { ...scan, ...scoreFolder(name, entries) }
  })
}

// Pastas candidatas, sem repetir as que já estão dentro de outra candidata (de alta confiança ou do mesmo nível).
export function detectNoiseFolders(root: NoiseTree): FolderScan[] {
  const candidates = scanFolders(root).filter((scan) => scan.confidence !== null)
  return candidates.filter((scan) => !candidates.some((other) => other !== scan && (other.confidence === 'high' || other.confidence === scan.confidence) && scan.path.startsWith(`${other.path}/`)))
}
