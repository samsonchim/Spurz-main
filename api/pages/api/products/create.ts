import type { NextApiRequest, NextApiResponse } from 'next'
import cors from '../../../lib/cors'
import { supabaseAdmin } from '../../../services/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)

  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const {
    outletId,
    name,
    description,
    price,
    oldPrice,
    category,
    brand,
    sku,
    stockQuantity,
    color,
    size,
    condition,
    status,
    isFeatured,
    tags,
    images
  } = req.body

  // Validate required fields
  if (!outletId || !name || !price) {
    return res.status(400).json({ ok: false, error: 'Missing required fields: outletId, name, and price are required' })
  }

  // Ensure supabaseAdmin client is configured
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ ok: false, error: 'Server not configured for DB access' })
  }

  try {
    // First, verify the outlet exists and belongs to the user
    const { data: outlet, error: outletError } = await supabaseAdmin
      .from('outlets')
      .select('id, owner_id')
      .eq('id', outletId)
      .single()

    if (outletError || !outlet) {
      return res.status(404).json({ ok: false, error: 'Outlet not found' })
    }

    // Create the product
    const productData = {
      outlet_id: outletId,
      name: name.trim(),
      description: description?.trim() || null,
      price: parseFloat(price),
      old_price: oldPrice ? parseFloat(oldPrice) : null,
      category: category || null,
      brand: brand?.trim() || null,
      sku: sku?.trim() || null,
      stock_quantity: stockQuantity || 0,
      color: color?.trim() || null,
      size: size?.trim() || null,
      condition: condition || 'new',
      status: status || 'active',
      is_featured: isFeatured || false,
      tags: tags || [],
      images: images || [],
      published_at: new Date().toISOString()
    }

    const { data: product, error: insertError } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (insertError) {
      console.error('Product creation error:', insertError)
      return res.status(500).json({ ok: false, error: 'Failed to create product', details: insertError.message })
    }

    return res.status(201).json({ 
      ok: true, 
      message: 'Product created successfully',
      product: product
    })
  } catch (e: any) {
    console.error('Product creation error:', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Internal server error' })
  }
}