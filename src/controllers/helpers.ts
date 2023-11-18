export const isEnvironmentVariablesSetForApiUrl =
  Boolean(process.env.X_API_KEY) &&
  Boolean(process.env.OPENVOLT_API_URL) &&
  Boolean(process.env.OPENVOLT_API_VERSION)
