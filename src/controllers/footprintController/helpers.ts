import { isEnvironmentVariablesSetForApiUrl } from '../helpers'
import { FootprintRequest } from '../types'
import {
  FuelGenerationShareType,
  FuelGenerationType,
  IntervalDataItem,
  PollutionFuelMixDataItem,
  PollutionFuelMixDataMap,
  PollutionFuelMixShareMap,
  PollutionIntensityDataItem,
  PollutionIntensityMap,
} from './types'
import {
  GRAMS_IN_KILOGRAM,
  NATIONAL_GRID_DATE_FORMAT,
  NATIONAL_GRID_DATE_RANGE_LIMIT,
  UNIT_KWH,
} from './constants'
import { format, parseISO } from 'date-fns'

export const isEnvironmentVariablesSetForFootprint =
  isEnvironmentVariablesSetForApiUrl &&
  Boolean(process.env.DASHBOARD_API_ENDPOINT_FOOTPRINT)

export const errorMessageBasedOnQuery = ({
  meter_id,
  meter_number,
  customer_id,
  granularity,
  start_date,
  end_date,
  lookback,
}: FootprintRequest) => {
  if (
    (meter_id && (meter_number || customer_id)) ||
    !(meter_id || meter_number || customer_id) ||
    (!meter_id && !(meter_number && customer_id))
  ) {
    return 'Please specify either "meter_id" or ("meter_number" AND "customer_id")'
  }

  if (lookback && (start_date || end_date)) {
    return 'Please specify either "lookback" or ("start_date" AND "end_date")'
  }

  if (!granularity) {
    return 'Please specify the "granularity"'
  }

  if (!lookback && !start_date) {
    return 'Please specify the "start_date"'
  }

  if (!lookback && !end_date) {
    return 'Please specify the "end_date"'
  }

  return ''
}

export const calculateTotalEnergyConsumption = (
  intervalData: IntervalDataItem[],
  thresholdDate: Date
) =>
  intervalData
    ? intervalData.reduce((partialSum: number, dataItem: IntervalDataItem) => {
        if (new Date(dataItem.start_interval) < thresholdDate) {
          const parsedConsumption = Number(dataItem.consumption)

          if (isNaN(parsedConsumption)) {
            return partialSum
          }

          return partialSum + parsedConsumption
        }
        return partialSum
      }, 0)
    : -1

export const isDateRangeValidForNationalGridLimit = (
  startDate: Date,
  endDate: Date
) => startDate.getTime() - endDate.getTime() <= NATIONAL_GRID_DATE_RANGE_LIMIT

// pollutionIntensityData - the units 'gCO2eq/kWh' are GRAMS of carbon dioxide equivalent per kilowatt-hour of electricity generated.
export const calculateCO2EmittedKgs = (
  intervalData: IntervalDataItem[],
  pollutionIntensityData: PollutionIntensityDataItem[]
) => {
  if (!intervalData || !pollutionIntensityData) {
    return -1
  }

  let totalCO2EmittedGrams = 0

  const pollutionIntensityMap: PollutionIntensityMap = {}

  pollutionIntensityData.forEach(
    (pollutionIntensityDataItem) =>
      (pollutionIntensityMap[pollutionIntensityDataItem.from] =
        pollutionIntensityDataItem.intensity.actual)
  )

  intervalData.forEach((intervalDataItem) => {
    const startInterval = format(
      parseISO(intervalDataItem.start_interval),
      NATIONAL_GRID_DATE_FORMAT
    )

    const consumption = Number(intervalDataItem.consumption)
    const intensity = pollutionIntensityMap?.[startInterval]

    if (!isNaN(consumption) && Boolean(intensity) && intensity !== 0) {
      totalCO2EmittedGrams += consumption * intensity
    }
  })
  return !isNaN(totalCO2EmittedGrams)
    ? totalCO2EmittedGrams / GRAMS_IN_KILOGRAM
    : -1
}

export const calculateFuelMix = (
  intervalData: IntervalDataItem[],
  pollutionFuelMixData: PollutionFuelMixDataItem[],
  totalEnergyConsumption: number
) => {
  if (!intervalData || !pollutionFuelMixData) {
    return
  }

  let energyWithUnknownOrigin = 0

  const fuelMixSharesKWH: any = {}
  const fuelMixShares: any = {}

  const pollutionFuelMixDataMap: PollutionFuelMixDataMap = {}
  const pollutionFuelMixShareMap: PollutionFuelMixShareMap = {}

  pollutionFuelMixData.forEach(
    (pollutionFuelMixDataItem) =>
      (pollutionFuelMixDataMap[pollutionFuelMixDataItem.from] =
        pollutionFuelMixDataItem.generationmix)
  )

  // calculate the shares for each fuel type for each interval
  intervalData.forEach((intervalDataItem) => {
    const startInterval: string = format(
      parseISO(intervalDataItem.start_interval),
      NATIONAL_GRID_DATE_FORMAT
    )

    const parsedConsumption = Number(intervalDataItem.consumption)

    if (isNaN(parsedConsumption)) {
      return undefined
    }

    const pollutionFuelMixForStartDate = pollutionFuelMixDataMap[startInterval]

    if (!pollutionFuelMixForStartDate) {
      return
    }

    pollutionFuelMixShareMap[startInterval] = pollutionFuelMixForStartDate
      .map(({ fuel, perc }: FuelGenerationType) => {
        const kWHShare = (parsedConsumption * perc) / 100

        if (isNaN(kWHShare)) {
          return undefined
        }

        return { fuel, kWHShare }
      })
      .filter(Boolean) as FuelGenerationShareType[]
  })

  // calculate the sum of the shares for each fuel type
  Object.values(pollutionFuelMixShareMap).forEach((shares) => {
    shares.forEach(({ fuel, kWHShare }) => {
      if (!fuelMixSharesKWH[fuel]) {
        fuelMixSharesKWH[fuel] = 0
      }
      fuelMixSharesKWH[fuel] += kWHShare
    })
  })

  const shares: number[] = Object.values(fuelMixSharesKWH)

  const totalEnergyWithAccountedOrigin = shares.reduce(
    (partialSum, fuelMixShare) => partialSum + fuelMixShare,
    0
  )

  energyWithUnknownOrigin =
    totalEnergyConsumption - totalEnergyWithAccountedOrigin

  Object.keys(fuelMixSharesKWH).forEach((fuelType) => {
    const fuelMixShareKWH = fuelMixSharesKWH[fuelType]
    const fuelMixSharePercentage =
      fuelMixShareKWH / totalEnergyWithAccountedOrigin
    fuelMixShares[fuelType] = Number(fuelMixSharePercentage.toFixed(3))
  })

  return {
    generationMix: fuelMixShares,
    energyWithUnknownOrigin: Number(energyWithUnknownOrigin.toFixed(2)),
    energyWithUnknownOriginUnit: UNIT_KWH,
  }
}
