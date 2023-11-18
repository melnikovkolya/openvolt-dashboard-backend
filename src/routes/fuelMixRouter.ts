import { Router } from 'express'
import { fuelMixController } from '../controllers'

export const fuelMixRouter = Router()

fuelMixRouter.get('/fuel-mix/:fromDateTime/:toDateTime', fuelMixController.get)
