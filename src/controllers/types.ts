export type Granularity = 'hh' | 'day' | 'week' | 'month' | 'year'

export type FootprintRequest = {
  granularity: Granularity
  start_date: string
  end_date: string
  meter_id?: string
  meter_number?: string
  customer_id?: string
  lookback?: string
}
