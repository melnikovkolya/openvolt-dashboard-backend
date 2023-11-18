import type { Request, Response } from 'express'
import { getMetersForMeterId } from './services'

const get = async (req: Request, res: Response) => {
  const meter_id = req.params.meter_id

  if (!meter_id) {
    return res.send('Please specify the meter_id')
  }

  const meters = await getMetersForMeterId(meter_id)

  res.send(meters)
}

export const metersController = { get }
