
# Energy Footprint Calculator - Backend

It is a simple REST API written in node and Express using TypeScript.

Given a `meter_id` and a `start_date` and `end_date` it returns the energy footprint of the meter in the given period.

The footprint consists of the following properties:
* total energy consumption
* total CO2 emitted 
* the fuel mix based on the National Grid's fuel mix data.

The **total energy** consumption is calculated by summing up the energy consumption of the meter in the given period.

The **total amount of CO2** (kgs) emitted by the electricity generated for the given meter in the given period
is calculated by taking the sum of the multiplication of the energy consumption of the meter in half-hourly 
intervals by the matching half-hourly CO2 average levels of the National Grid's CO2 level data.

The **fuel mix** is calculated by taking the sum of the multiplication of the energy consumption of the meter in half-hourly
intervals by the matching half-hourly fuel mix of the National Grid's fuel mix data.


The backend dashboard uses the following REST API endpoints to retrieve the data:
* [Openvolt API v.1](https://docs.openvolt.com/reference/introduction) - openvolt.com
* [Carbon Intensity API v.2.0.0](https://carbon-intensity.github.io/api-definitions/#carbon-intensity-api-v2-0-0)- National Grid (GB)


## Installation

Clone the repository and navigate into it.

Create an `.env` file with the contents provided in the `example.env` file. Make sure to set the `X_API_KEY` value as suggested in the `example.env` file.

Run

```bash
yarn install
```

to install all of the dependency packages.

## Usage

```bash
yarn dev
```
to start the server in development mode.


## API

### GET /footprint
Returns a data object for the given `meter_id` or a combination of (`meter_number` and `customer_id`) 
and a `start_date` and `end_date` with the granularity of half-hour (`hh`).

The returned data object contains the following properties:
* `totalEnergyConsumption`: `number` - the total energy consumption of the meter in the given period
* `totalEnergyConsumptionUnit`: `string` - the unit of the total energy consumption (e.g., `kWh`)
* `emittedCO2`: `number` - the total amount of CO2 emitted by the energy consumption of the meter in the given period
* `emittedCO2Unit`: `string` - the unit of the emitted CO2 (e.g., `kg`)
* `fuelMix`: `Object` - the fuel mix of the UK grid in the given period
  * `energyWithUnknownOrigin`: `number` - the total energy consumption of the meter in the given period for which the origin is unknown
  * `energyWithUnknownOriginUnit`: `string` - the unit of the energy consumption for which the origin is unknown (e.g., `kWh`)
  * `generationMix`: `Object[]` - the fuel mix for a given `meter_id` in the given period
    * `biomass`: `number` - the share of biomass for a given `meter_id` in the given period
    * `coal`: `number` - the share of coal for a given `meter_id` in the given period
    * `imports`: `number` - the share of imports for a given `meter_id` in the given period
    * `gas`: `number` - the share of gas for a given `meter_id` in the given period
    * `nuclear`: `number` - the share of nuclear for a given `meter_id` in the given period
    * `other`: `number` - the share of other for a given `meter_id` in the given period
    * `hydro`: `number` - the share of hydro for a given `meter_id` in the given period
    * `solar`: `number` - the share of solar for a given `meter_id` in the given period
    * `wind`: `number` - the share of wind for a given `meter_id` in the given period

#### Query parameters
* `meter_id` - the id of the meter for which the data is requested
* `meter_number` - the number of the meter for which the data is requested
* `customer_id` - the id of the customer for which the data is requested
* `granularity` - the granularity of the data (e.g., `hh` (half-hourly), `day`, `week`, `month`,  `year`). 
* `start_date` - the start date (ISO 8601) of the requested period, default: `2023-01-01T00:00:00Z`
* `end_date` - the end date (ISO 8601) of the requested period, default: `2023-02-01T00:00:00Z`
* `lookback` - the look back period from current date (e.g., `1d`, `2w`, `3m`, `4y`)

#### Examples

```
/footprint?meter_id=6514167223e3d1424bf82742&granularity=hh&start_date=2023-01-01T00:00:00Z&end_date=2023-02-01T00:00:00Z
```

#### Notes
* the share values are fixed to 2 decimal places, so 0.00% is returned for a value of 0.0001%.
* the `energyWithUnknownOrigin` is calculated by subtracting the sum of the `generationMix` with accounted origin from the `totalEnergyConsumption`.
* either `meter_id` or a combination of (`meter_number` and `customer_id`) must be provided.
* `lookback` is an alternative to `start_date` and `end_date` and it is used to calculate the `start_date` and `end_date` based on the current date.
  In this example we only make use of the `start_date` and `end_date` query parameters.
* `granularity` value of `hh` is the only supported value at the moment.
  * `start_date` and `end_date` must be provided in the ISO 8601 format.
