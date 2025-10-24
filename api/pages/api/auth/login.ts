import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'

// Very small example login endpoint that validates presence of email/password and returns a mock token.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  // NOTE: This should authenticate against DB. Here we return a fake token for demonstration.
  const token = `token_${Buffer.from(email).toString('hex')}_${Date.now()}`
  return res.status(200).json({ token, user: { email } })
}
