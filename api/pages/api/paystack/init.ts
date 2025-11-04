import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../lib/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ ok: false, error: 'Paystack not configured' });

  try {
    const { amount, email, invoiceId } = req.body || {};
    if (!amount || !email || !invoiceId) return res.status(400).json({ ok: false, error: 'amount, email, invoiceId required' });
    const reference = `INV_${invoiceId}_${Date.now()}`;
    const origin = (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host'])
      ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
      : (req.headers.origin || '');
    const callback_url = origin ? `${origin}/api/paystack/callback?invoiceId=${encodeURIComponent(invoiceId)}` : undefined;
    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, amount: Math.round(Number(amount) * 100), reference, ...(callback_url ? { callback_url } : {}) }),
    });
    const json = await initRes.json();
    if (!initRes.ok || !json?.data?.authorization_url) {
      return res.status(500).json({ ok: false, error: 'Failed to initialize payment' });
    }
    return res.status(200).json({ ok: true, authorizationUrl: json.data.authorization_url, reference });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Internal error' });
  }
}
