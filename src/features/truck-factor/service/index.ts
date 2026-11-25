import { TruckFactorManager } from './TruckFactorManager'
import { TruckFactorRepository } from './TruckFactorRepository'

export const truckFactorManager = new TruckFactorManager(new TruckFactorRepository())
