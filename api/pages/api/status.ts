import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../lib/cors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  // Simple status endpoint for testing the API server is running.
  res.status(200).json({ status: 'ok', time: new Date().toISOString() })
}
