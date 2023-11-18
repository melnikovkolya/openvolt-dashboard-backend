import { Router } from 'express'
import { intervalDataController } from '../controllers'

export const intervalDataRouter = Router()

intervalDataRouter.get('/interval-data', intervalDataController.get)
