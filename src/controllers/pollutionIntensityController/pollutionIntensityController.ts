import type { Request, Response } from 'express'
import { getPollutionIntensity } from './services'

const get = async (req: Request, res: Response) => {
  const start_date = req.params.start_date
  const end_date = req.params.end_date

  if (!start_date || !end_date) {
    return res.send(
      'Please specify the date period, e.g., "/pollution-intensity/{fromDateTime: 2023-08-25T15:30Z}/{toDateTime: 2023-08-27T17:00Z}"'
    )
  }

  const meters = await getPollutionIntensity({ start_date, end_date })

  res.send(meters)
}

export const pollutionIntensityController = { get }
