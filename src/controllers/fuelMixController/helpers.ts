import { isEnvironmentVariablesSetForApiUrl } from '../helpers'

export const isEnvironmentVariablesSetForPollutionIntensity =
  isEnvironmentVariablesSetForApiUrl &&
  Boolean(process.env.NATIONAL_GRID_CARBON_INTENSITY_API_URL)
