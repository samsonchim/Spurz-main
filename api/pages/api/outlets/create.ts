import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  const { name, locations, category, phone, about, userId, logoBase64, logoType } = req.body || {}

  if (!name || !userId) {
    return res.status(400).json({ ok: false, error: 'name and userId are required' })
  }

  try {
    const insertPayload: any = {
      owner_id: userId,
      name,
      locations,
      category,
      phone,
      about,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from('outlets').insert([insertPayload]).select().single()
    if (error) {
      console.error('insert outlet error', error)
      return res.status(500).json({ ok: false, error: error.message || 'DB insert failed' })
    }

    const outletId = (data as any).id
    let logoUrl: string | null = null

    if (logoBase64) {
      // determine extension from logoType or default to png
      const ext = (logoType && logoType.split('/')?.[1]) || 'png'
      const dir = path.join(process.cwd(), 'public', 'outlets', 'logos')
      try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        const filePath = path.join(dir, `${outletId}.${ext}`)
        const buffer = Buffer.from(logoBase64, 'base64')
        fs.writeFileSync(filePath, buffer)
        logoUrl = `/outlets/logos/${outletId}.${ext}`
        // update the outlet with logo_path
        await supabaseAdmin.from('outlets').update({ logo_path: logoUrl, updated_at: new Date().toISOString() }).eq('id', outletId)
      } catch (fsErr) {
        console.error('failed to save logo', fsErr)
      }
    }

    return res.status(201).json({ ok: true, outletId, logoUrl })
  } catch (e: any) {
    console.error('outlet create error', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Internal error' })
  }
}
