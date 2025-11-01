import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { outletId, imageBase64 } = req.body || {}

  if (!outletId || !imageBase64) {
    return res.status(400).json({ ok: false, error: 'outletId and imageBase64 are required' })
  }

  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured')
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    const logosDir = path.join(process.cwd(), 'public', 'outlets', 'logos')
    if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true })

    const base64 = (imageBase64 as string).includes(',') ? (imageBase64 as string).split(',')[1] : imageBase64
    const buf = Buffer.from(base64, 'base64')
    const png = await sharp(buf).png().toBuffer()

    const filename = `${outletId}.png`
    const filePath = path.join(logosDir, filename)
    fs.writeFileSync(filePath, png)

    const logoPath = `/outlets/logos/${filename}`

    const { data, error } = await supabaseAdmin
      .from('outlets')
      .update({ logo_path: logoPath, updated_at: new Date().toISOString() })
      .eq('id', outletId)
      .select()
      .single()

    if (error) {
      console.error('update logo error', error)
      return res.status(500).json({ ok: false, error: 'Failed to update outlet logo' })
    }

    return res.status(200).json({ ok: true, logo_path: logoPath, outlet: data })
  } catch (e: any) {
    console.error('upload logo error', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
