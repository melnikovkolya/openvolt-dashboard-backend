import { isEnvironmentVariablesSetForApiUrl } from '../helpers'

export const isEnvironmentVariablesSetForMeters =
  isEnvironmentVariablesSetForApiUrl &&
  Boolean(process.env.OPENVOLT_API_ENDPOINT_METERS)
