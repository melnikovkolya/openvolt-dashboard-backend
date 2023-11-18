import type { Request, Response } from 'express'

const get = (req: Request, res: Response) => {
  res.send(
    `Welcome to openvolt dashboard backend. ${
      process.env.OPENVOLT_API_VERSION &&
      ` API ${process.env.OPENVOLT_API_VERSION}.`
    }`
  )
}

export default { get }
