import dotenv from 'dotenv'
dotenv.config()

import express, { Application } from 'express'
import {
  rootRouter,
  metersRouter,
  intervalDataRouter,
  pollutionIntensityRouter,
  fuelMixRouter,
  footprintRouter,
} from './routes'
import cors from 'cors'

const app: Application = express()
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

app.use(cors())

app.use(rootRouter)
app.use(metersRouter)
app.use(intervalDataRouter)
app.use(pollutionIntensityRouter)
app.use(fuelMixRouter)
app.use(footprintRouter)
