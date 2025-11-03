// Marketing and campaign configuration for the app UI.
// Build promo image URL from API_BASE with a repo-hosted asset; fallback to a reliable https image.
import { API_BASE } from '../services/api';

// Next.js serves files in the `public` folder from the root path, not /public.
// Since this API runs as a separate Next.js app, the correct URL is `${API_BASE}/hallowenn.png`.
const LOCAL_PROMO = `${API_BASE}/hallowenn.png`;
export const PROMO_FALLBACK_URL = 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1200&auto=format&fit=crop';

// Default promo image URL (client can handle onError to fall back)
export const PROMO_IMAGE_URL = LOCAL_PROMO;
