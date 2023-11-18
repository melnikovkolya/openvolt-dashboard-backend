import { Router } from 'express'
import { footprintController } from '../controllers'

export const footprintRouter = Router()

footprintRouter.get('/footprint', footprintController.get)
