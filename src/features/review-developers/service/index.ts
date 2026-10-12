import { ReviewDevelopersManager } from './ReviewDevelopersManager'
import { ReviewDevelopersRepository } from './ReviewDevelopersRepository'

export const reviewDevelopersManager = new ReviewDevelopersManager(new ReviewDevelopersRepository())
