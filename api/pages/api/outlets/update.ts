import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { outletId, logo_path, cover_photo_path, face_of_brand_path, name, category, locations, phone, about } = req.body || {}

  if (!outletId) {
    return res.status(400).json({ ok: false, error: 'outletId is required' })
  }

  // Ensure supabaseAdmin client is configured
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    // Build update object with only provided fields
    const updateData: any = {}
    if (logo_path !== undefined) updateData.logo_path = logo_path
    if (cover_photo_path !== undefined) updateData.cover_photo_path = cover_photo_path
    if (face_of_brand_path !== undefined) updateData.face_of_brand_path = face_of_brand_path
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (locations !== undefined) updateData.locations = locations
    if (phone !== undefined) updateData.phone = phone
    if (about !== undefined) updateData.about = about
    updateData.updated_at = new Date().toISOString()

    const { data: outlet, error } = await supabaseAdmin
      .from('outlets')
      .update(updateData)
      .eq('id', outletId)
      .select()
      .single()

    if (error) {
      console.error('Update outlet error:', error)
      return res.status(500).json({ ok: false, error: 'Failed to update outlet' })
    }

    return res.status(200).json({ ok: true, outlet })
  } catch (e: any) {
    console.error('Update outlet error:', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}
