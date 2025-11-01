import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { outletId, filename } = req.query

  if (!outletId || !filename) {
    return res.status(400).json({ error: 'Missing outletId or filename' })
  }

  try {
    // Construct the file path
    const filePath = join(process.cwd(), 'public', 'outlets', 'logos', filename as string)
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    // Read the file
    const fileBuffer = await readFile(filePath)
    
    // Determine content type based on file extension
    const ext = (filename as string).split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
    }

    // Set headers and send file
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    res.status(200).send(fileBuffer)
  } catch (error) {
    console.error('Error serving file:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
