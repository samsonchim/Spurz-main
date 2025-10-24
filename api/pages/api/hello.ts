import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../lib/cors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // run CORS
  await cors(req, res)

  res.status(200).json({ message: 'Hello from Spurz API' })
}
