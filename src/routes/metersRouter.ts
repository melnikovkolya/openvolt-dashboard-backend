import { Router } from 'express'
import { metersController } from '../controllers'

export const metersRouter = Router()

metersRouter.get('/meters/:meter_id', metersController.get)
