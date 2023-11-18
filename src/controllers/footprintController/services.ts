import {
  calculateCO2EmittedKgs,
  calculateFuelMix,
  calculateTotalEnergyConsumption,
  isDateRangeValidForNationalGridLimit,
  isEnvironmentVariablesSetForFootprint,
} from './helpers'
import { getIntervalDataForMeterId } from '../intervalDataController/services'
import { getPollutionIntensity } from '../pollutionIntensityController/services'
import { FootprintRequest } from '../types'
import { format, parseISO, subSeconds } from 'date-fns'
import {
  ISO_DATE_FORMAT_WITH_TIMEZONE,
  NATIONAL_GRID_DATE_RANGE_LIMIT,
  OPEN_VOLT_API_DATE_FORMAT,
  UNIT_KG,
  UNIT_KWH,
  UNKNOWN,
} from './constants'
import { getPollutionFuelMix } from '../fuelMixController/services'

export const getFootprint = async ({
  meter_id,
  meter_number,
  customer_id,
  granularity,
  start_date,
  end_date,
  lookback,
}: FootprintRequest) => {
  if (!isEnvironmentVariablesSetForFootprint) {
    return 'Please ensure that environment variables are set for "footprint"'
  }

  try {
    const parsedISOStartDate = parseISO(start_date)
    const parsedISOEndDate = parseISO(end_date)
    const parsedISOEndDateNationalGrid = subSeconds(parsedISOEndDate, 1) // National Grid API is exclusive of the end date

    if (
      !isDateRangeValidForNationalGridLimit(
        parsedISOEndDate,
        parsedISOEndDateNationalGrid
      )
    ) {
      return `The date range cannot exceed ${NATIONAL_GRID_DATE_RANGE_LIMIT} milliseconds (31 days)`
    }

    const openVoltStartDate = format(
      parsedISOStartDate,
      OPEN_VOLT_API_DATE_FORMAT
    )
    const openVoltEndDate = format(parsedISOEndDate, OPEN_VOLT_API_DATE_FORMAT)

    const nationalGridEndDate = format(
      parsedISOEndDateNationalGrid,
      ISO_DATE_FORMAT_WITH_TIMEZONE
    )

    const intervalDataPromise = getIntervalDataForMeterId({
      meter_id,
      customer_id,
      granularity,
      meter_number,
      start_date: openVoltStartDate,
      end_date: openVoltEndDate,
      lookback,
    })

    const pollutionIntensityPromise = getPollutionIntensity({
      start_date,
      end_date: nationalGridEndDate,
    })

    const pollutionFuelMixPromise = getPollutionFuelMix({
      start_date,
      end_date: nationalGridEndDate,
    })

    const [intervalData, pollutionIntensityData, pollutionFuelMixData] =
      await Promise.all([
        intervalDataPromise,
        pollutionIntensityPromise,
        pollutionFuelMixPromise,
      ])

    const totalEnergyConsumption = calculateTotalEnergyConsumption(
      intervalData.data,
      parsedISOEndDate
    )

    const emittedCO2 = calculateCO2EmittedKgs(
      intervalData.data,
      pollutionIntensityData.data
    )

    const fuelMix = calculateFuelMix(
      intervalData.data,
      pollutionFuelMixData.data,
      totalEnergyConsumption
    )

    return {
      totalEnergyConsumption,
      totalEnergyConsumptionUnit:
        intervalData.data?.[0].consumption_units ?? UNIT_KWH,
      emittedCO2,
      emittedCO2Unit: UNIT_KG,
      fuelMix,
    }
  } catch (error) {
    console.error(error)
    return `An error occurred while fetching footprint data sources: ${error}`
  }
}
