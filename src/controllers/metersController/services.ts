import { isEnvironmentVariablesSetForMeters } from './helpers'

export const getMetersForMeterId = async (meter_id: string) => {
  if (!isEnvironmentVariablesSetForMeters) {
    return 'Please ensure that environment variables are set for "meters"'
  }

  const metersUrl = `${process.env.OPENVOLT_API_URL}/${process.env.OPENVOLT_API_VERSION}/${process.env.OPENVOLT_API_ENDPOINT_METERS}/${meter_id}`

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-api-key': process.env.X_API_KEY ?? '',
    },
  }

  try {
    const response = await fetch(metersUrl, options)

    return await response.json()
  } catch (error) {
    console.error(error)
    return error
  }
}
