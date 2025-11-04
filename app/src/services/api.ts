import { Platform } from 'react-native';
import Constants from 'expo-constants';
import CONFIG_BASE from '../config/apiBase';
import { loadingController } from '../store/globalLoading';

// Resolution order:
// 1. expo constants extra (if provided)
// 2. EXPO_PUBLIC_API_BASE (process.env) — may not be present in RN runtime
// 3. explicit config file `app/src/config/apiBase.ts` for easy local edits
// 4. platform fallback (emulator localhost addresses)
const fromConstants = (Constants as any)?.expoConfig?.extra?.API_BASE || (Constants as any)?.manifest?.extra?.API_BASE;
const API_BASE =
  fromConstants || process.env.EXPO_PUBLIC_API_BASE || CONFIG_BASE || (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');
export { API_BASE };

export async function apiPost<T = any>(
  path: string,
  body?: any,
  token?: string,
  opts?: { showLoading?: boolean }
): Promise<{ ok: boolean; data?: T; status: number; error?: string }> {
  try {
    const showLoading = opts?.showLoading !== false;
    if (showLoading) loadingController.increment();
    // ensure path hits Next.js API routes under /api
    const normalizedPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : '/' + path}`;
    if ((global as any).__DEV__) console.log(`[api] POST ${API_BASE}${normalizedPath}`);
    const res = await fetch(`${API_BASE}${normalizedPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body || {}),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, status: res.status, error: json?.error || 'Request failed' };
    return { ok: true, status: res.status, data: json as T };
  } catch (e: any) {
    return { ok: false, status: 0, error: e?.message || 'Network error' };
  } finally {
    const showLoading = opts?.showLoading !== false;
    if (showLoading) loadingController.decrement();
  }
}

export async function apiGet<T = any>(
  path: string,
  token?: string,
  opts?: { showLoading?: boolean }
): Promise<{ ok: boolean; data?: T; status: number; error?: string }> {
  try {
    const showLoading = opts?.showLoading !== false;
    if (showLoading) loadingController.increment();
    const normalizedPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : '/' + path}`;
    if ((global as any).__DEV__) console.log(`[api] GET ${API_BASE}${normalizedPath}`);
    const res = await fetch(`${API_BASE}${normalizedPath}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, status: res.status, error: json?.error || 'Request failed' };
    return { ok: true, status: res.status, data: json as T };
  } catch (e: any) {
    return { ok: false, status: 0, error: e?.message || 'Network error' };
  } finally {
    const showLoading = opts?.showLoading !== false;
    if (showLoading) loadingController.decrement();
  }
}

export async function apiPatch<T = any>(
  path: string,
  body?: any,
  token?: string,
  opts?: { showLoading?: boolean }
): Promise<{ ok: boolean; data?: T; status: number; error?: string }> {
  try {
    const showLoading = opts?.showLoading !== false;
    if (showLoading) loadingController.increment();
    const normalizedPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : '/' + path}`;
    if ((global as any).__DEV__) console.log(`[api] PATCH ${API_BASE}${normalizedPath}`);
    const res = await fetch(`${API_BASE}${normalizedPath}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body || {}),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, status: res.status, error: json?.error || 'Request failed' };
    return { ok: true, status: res.status, data: json as T };
  } catch (e: any) {
    return { ok: false, status: 0, error: e?.message || 'Network error' };
  } finally {
    const showLoading = opts?.showLoading !== false;
    if (showLoading) loadingController.decrement();
  }
}
