import {
  addQueryParamsToUrl,
  isEnvironmentVariablesSetForIntervalData,
} from './helpers'
import { FootprintRequest } from '../types'

export const getIntervalDataForMeterId = async ({
  meter_id,
  granularity,
  meter_number,
  customer_id,
  start_date,
  end_date,
  lookback,
}: FootprintRequest) => {
  if (!isEnvironmentVariablesSetForIntervalData) {
    return 'Please ensure that environment variables are set for "interval data"'
  }

  let intervalDataUrl = `${process.env.OPENVOLT_API_URL}/${process.env.OPENVOLT_API_VERSION}/${process.env.OPENVOLT_API_ENDPOINT_INTERVAL_DATA}?granularity=${granularity}`

  intervalDataUrl = addQueryParamsToUrl(intervalDataUrl, {
    meter_id,
    meter_number,
    customer_id,
    start_date,
    end_date,
    lookback,
  })

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-api-key': process.env.X_API_KEY ?? '',
    },
  }

  try {
    const response = await fetch(intervalDataUrl, options)

    return await response.json()
  } catch (error) {
    console.error(error)
    return error
  }
}
