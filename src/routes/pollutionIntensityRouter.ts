import { Router } from 'express'
import { pollutionIntensityController } from '../controllers'

export const pollutionIntensityRouter = Router()

pollutionIntensityRouter.get(
  '/pollution-intensity/:start_date/:end_date',
  pollutionIntensityController.get
)
