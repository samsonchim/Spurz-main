import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../lib/cors';
import { supabaseAdmin } from '../../../services/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method not allowed');
  }
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const { reference, invoiceId } = req.query as { reference?: string; invoiceId?: string };
  if (!secret || !reference || !invoiceId) {
    return res.status(400).send('Missing configuration or params');
  }
  try {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const json = await verifyRes.json();
    const success = json?.data?.status === 'success';
    if (success && supabaseAdmin) {
      await supabaseAdmin.rpc('update_invoice_status', { p_invoice_id: invoiceId, p_status: 'paid' });
    }
    // simple HTML response to let the user return to app
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Payment ${success ? 'Successful' : 'Failed'}</title></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial; padding: 20px;">
      <h2>Payment ${success ? 'Successful ✅' : 'Failed ❌'}</h2>
      <p>${success ? 'Your payment has been received and funds are now held in escrow.' : 'We could not complete your payment.'}</p>
      <p>You can close this tab and return to the app.</p>
      </body></html>`);
  } catch (e: any) {
    return res.status(500).send('Error verifying payment');
  }
}
