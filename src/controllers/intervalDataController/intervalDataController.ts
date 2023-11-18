import type { Request, Response } from 'express'
import { getIntervalDataForMeterId } from './services'
import { Granularity } from '../types'

const get = async (req: Request, res: Response) => {
  const granularity = req.query.granularity as Granularity
  const meter_id = req.query.meter_id as string
  const customer_id = req.query.customer_id as string
  const meter_number = req.query.meter_number as string
  const start_date = req.query.start_date as string
  const end_date = req.query.end_date as string
  const lookback = req.query.lookback as string

  const intervalData = await getIntervalDataForMeterId({
    meter_id,
    customer_id,
    granularity,
    meter_number,
    start_date,
    end_date,
    lookback,
  })

  res.send(intervalData)
}

export const intervalDataController = { get }
