import { CouplingManager } from './CouplingManager'
import { CouplingRepository } from './CouplingRepository'

export const couplingManager = new CouplingManager(new CouplingRepository())
