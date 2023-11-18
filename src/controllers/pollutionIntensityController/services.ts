import { isEnvironmentVariablesSetForPollutionIntensity } from './helpers'
import { PollutionIntensityArguments } from './types'

export const getPollutionIntensity = async ({
  start_date,
  end_date,
}: PollutionIntensityArguments) => {
  if (!isEnvironmentVariablesSetForPollutionIntensity) {
    return 'Please ensure that environment variables are set for "pollution controller"'
  }

  const pollutionIntensityUrl = `${process.env.NATIONAL_GRID_CARBON_INTENSITY_API_URL}/${process.env.NATIONAL_GRID_CARBON_INTENSITY_ENDPOINT_INTENSITY}/${start_date}/${end_date}`

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  try {
    const response = await fetch(pollutionIntensityUrl, options)

    return await response.json()
  } catch (error) {
    console.error(error)
    return error
  }
}
