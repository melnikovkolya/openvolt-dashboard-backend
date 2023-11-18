import type { Request, Response } from 'express'
import { getFootprint } from './services'
import { Granularity } from '../types'
import { errorMessageBasedOnQuery } from './helpers'

const get = async (req: Request, res: Response) => {
  const meter_id = req.query.meter_id as string
  const meter_number = req.query.meter_number as string
  const customer_id = req.query.customer_id as string
  const granularity = req.query.granularity as Granularity
  const start_date = req.query.start_date as string
  const end_date = req.query.end_date as string
  const lookback = req.query.lookback as string

  const errorMessage = errorMessageBasedOnQuery({
    meter_id,
    meter_number,
    customer_id,
    granularity,
    start_date,
    end_date,
    lookback,
  })

  if (Boolean(errorMessage)) {
    return res.send(errorMessage)
  }

  const footprint = await getFootprint({
    meter_id,
    meter_number,
    customer_id,
    granularity,
    start_date,
    end_date,
    lookback,
  })

  res.send(footprint)
}

export const footprintController = { get }
