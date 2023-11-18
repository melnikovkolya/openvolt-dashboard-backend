import type { Request, Response } from 'express'
import { getPollutionFuelMix } from './services'

const get = async (req: Request, res: Response) => {
  const start_date = req.params.start_date
  const end_date = req.params.end_date

  if (!start_date || !end_date) {
    return res.send(
      'Please specify the date period, e.g., "/fuel-mix/{fromDateTime: 2023-08-25T15:30Z}/{toDateTime: 2023-08-27T17:00Z}"'
    )
  }

  const meters = await getPollutionFuelMix({ start_date, end_date })

  res.send(meters)
}

export const fuelMixController = { get }
