import { describe, expect, it } from 'vitest'
import { detectNoiseFolders, scanFolders, tokenize, type NoiseTree } from './detectNoise'
import { pruneTree } from './pruneTree'

const file = (name: string, revisions = 3): NoiseTree => ({ name, revisions })
const generated = Array.from({ length: 30 }, (_, index) => file(`case-${index}.json`, 1))

const tree: NoiseTree = {
  name: 'repo',
  children: [
    { name: 'src', children: [file('a.ts'), file('b.ts'), { name: 'tests', children: [file('a.test.ts')] }] },
    { name: 'fixtures', children: [{ name: 'compiler', children: generated }] },
    { name: 'latest', children: [file('x.ts')] },
    { name: 'cases', children: generated },
    { name: 'node_modules', children: [file('y.js')] },
  ],
}

const confidenceOf = (path: string) => scanFolders(tree).find((scan) => scan.path === path)?.confidence

describe('tokenize', () => {
  it('separa por símbolos e camelCase', () => {
    expect(tokenize('__tests__')).toEqual(['tests'])
    expect(tokenize('testData-v2')).toEqual(['test', 'data', 'v2'])
  })
})

describe('detectNoiseFolders', () => {
  it('trata nomes fortes como alta confiança', () => {
    expect(confidenceOf('fixtures')).toBe('high')
    expect(confidenceOf('node_modules')).toBe('high')
  })

  it('trata nomes fracos como sugestão', () => {
    expect(confidenceOf('src/tests')).toBe('medium')
  })

  it('detecta pastas homogêneas pela estrutura, mesmo sem nome conhecido', () => {
    expect(confidenceOf('cases')).toBe('medium')
  })

  it('não confunde "latest" com "test"', () => {
    expect(confidenceOf('latest')).toBeNull()
  })

  it('não lista pastas dentro de outra candidata de mesma confiança', () => {
    const paths = detectNoiseFolders(tree).map((scan) => scan.path)
    expect(paths).toContain('fixtures')
    expect(paths).not.toContain('fixtures/compiler')
  })

  it('ignora uma pasta que concentra quase todo o repositório', () => {
    const project: NoiseTree = { name: 'repo', children: [{ name: 'build', children: generated }, { name: 'src', children: [file('a.ts')] }] }
    expect(scanFolders(project).find((scan) => scan.path === 'build')?.confidence).toBeNull()
  })
})

describe('pruneTree', () => {
  it('remove as pastas ocultas e as que ficam vazias', () => {
    const pruned = pruneTree(tree, new Set(['fixtures', 'node_modules', 'src/tests']))
    expect(pruned.children?.map((child) => child.name)).toEqual(['src', 'latest', 'cases'])
    expect(pruned.children?.[0].children?.map((child) => child.name)).toEqual(['a.ts', 'b.ts'])
  })

  it('devolve a mesma árvore quando nada está oculto', () => {
    expect(pruneTree(tree, new Set())).toBe(tree)
  })
})
