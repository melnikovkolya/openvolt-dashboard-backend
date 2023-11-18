import { isEnvironmentVariablesSetForPollutionIntensity } from './helpers'
import { PollutionFuelMixArguments } from './types'

export const getPollutionFuelMix = async ({
  start_date,
  end_date,
}: PollutionFuelMixArguments) => {
  if (!isEnvironmentVariablesSetForPollutionIntensity) {
    return 'Please ensure that environment variables are set for "pollution controller"'
  }

  const fuelMixUrl = `${process.env.NATIONAL_GRID_CARBON_INTENSITY_API_URL}/${process.env.NATIONAL_GRID_CARBON_INTENSITY_ENDPOINT_GENERATION}/${start_date}/${end_date}`

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  try {
    const response = await fetch(fuelMixUrl, options)

    return await response.json()
  } catch (error) {
    console.error(error)
    return error
  }
}
