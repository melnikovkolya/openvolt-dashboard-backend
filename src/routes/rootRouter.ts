import { Router } from 'express'
import rootController from '../controllers/rootController'

export const rootRouter = Router()

rootRouter.get('/', rootController.get)
