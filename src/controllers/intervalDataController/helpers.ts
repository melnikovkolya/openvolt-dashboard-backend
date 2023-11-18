import { isEnvironmentVariablesSetForApiUrl } from '../helpers'

export const isEnvironmentVariablesSetForIntervalData =
  isEnvironmentVariablesSetForApiUrl &&
  Boolean(process.env.OPENVOLT_API_ENDPOINT_INTERVAL_DATA)

export const addQueryParamsToUrl = (
  url: string,
  queryParams: Record<string, string | undefined>
) => {
  const queryParamKeys = Object.keys(queryParams)

  const queryParamValues = Object.values(queryParams)

  const queryParamEntries = queryParamKeys.map((key, index) => [
    key,
    queryParamValues[index],
  ])

  const queryParamEntriesWithValues = queryParamEntries.filter(
    (entry) => entry[1]
  )

  const queryParamEntriesWithValuesString = queryParamEntriesWithValues.map(
    (entry) => `${entry[0]}=${entry[1]}`
  )

  const queryParamEntriesWithValuesStringJoined =
    queryParamEntriesWithValuesString.join('&')

  return `${url}&${queryParamEntriesWithValuesStringJoined}`
}
