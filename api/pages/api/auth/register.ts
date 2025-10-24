import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'

// Very small example register endpoint that echoes back a created user id.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  // NOTE: This is a placeholder. Replace with real DB/storing logic.
  const id = `user_${Date.now()}`
  const user = { id, email }

  return res.status(201).json({ user })
}
