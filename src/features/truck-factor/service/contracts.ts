export type TruckFactorReport = {
  key_developers: string[]
  total_files_analyzed: number
  truck_factor: number
}

export type TruckFactorRequest = {
  // Pastas ocultas pelo usuário (caminhos a partir da raiz): os arquivos delas ficam fora do cálculo.
  excludedPaths: string[]
  // Identidades confirmadas como a mesma pessoa na revisão de desenvolvedores.
  groups: string[][]
  repositoryUrl: string
}
