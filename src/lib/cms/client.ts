import { Locale } from './types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';
const CMS_API_KEY = process.env.CMS_API_KEY;
const FETCH_TIMEOUT_MS = 15000;

interface FetchOptions extends RequestInit {
  locale?: Locale;
}

export async function fetchCMS<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { locale = 'en', headers: customHeaders, ...restOptions } = options;
  
  const url = new URL(`${CMS_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
  
  if (!url.searchParams.has('locale')) {
    url.searchParams.append('locale', locale);
  }
  if (!url.searchParams.has('depth')) {
    url.searchParams.append('depth', '1');
  }

  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (CMS_API_KEY) {
    headers.set('Authorization', `users API-Key ${CMS_API_KEY}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers,
      signal: controller.signal,
      next: { revalidate: 60, ...options.next },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CMS API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`CMS fetch timeout after ${FETCH_TIMEOUT_MS}ms: ${endpoint}`);
      throw new Error(`CMS request timed out: ${endpoint}`);
    }
    console.error(`Failed to fetch CMS data from ${endpoint}:`, error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
