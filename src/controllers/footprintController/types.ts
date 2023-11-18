export type IntervalDataItem = {
  start_interval: string
  meter_id: string
  meter_number: string
  customer_id: string
  consumption: string
  consumption_units: string
}

export type PollutionIntensityDataItem = {
  from: string
  to: string
  intensity: {
    forecast: number
    actual: number
    index: string
  }
}

export type PollutionIntensityMap = { [index: string]: any }

export enum FuelType {
  'biomass',
  'coal',
  'imports',
  'gas',
  'nuclear',
  'other',
  'hydro',
  'solar',
  'wind',
}

export type FuelMixShares = {
  [key in FuelType]: number
}

export type FuelGenerationType = {
  fuel: FuelType
  perc: number
}

export type FuelGenerationShareType = {
  fuel: FuelType
  kWHShare: number
}

export type PollutionFuelMixDataItem = {
  from: string
  to: string
  generationmix: FuelGenerationType[]
}

export type PollutionFuelMixDataMap = { [index: string]: FuelGenerationType[] }

export type PollutionFuelMixShareMap = {
  [index: string]: FuelGenerationShareType[]
}
