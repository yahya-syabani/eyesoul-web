import { Locale } from './types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';
const CMS_API_KEY = process.env.CMS_API_KEY; // Only needed if endpoints are restricted

interface FetchOptions extends RequestInit {
  locale?: Locale;
}

export async function fetchCMS<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { locale = 'en', headers: customHeaders, ...restOptions } = options;
  
  // Construct URL
  const url = new URL(`${CMS_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
  
  // Append locale query param if not already present
  // Note: Payload v3 localized docs often use ?locale=en
  if (!url.searchParams.has('locale')) {
    url.searchParams.append('locale', locale);
  }
  // For deep relation population we usually use ?depth=1 or depth=2
  if (!url.searchParams.has('depth')) {
    url.searchParams.append('depth', '1');
  }

  // Set up headers
  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (CMS_API_KEY) {
    headers.set('Authorization', `users API-Key ${CMS_API_KEY}`);
  }

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers,
      // For Next.js caching strategy (App Router)
      next: { revalidate: 60, ...options.next },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CMS API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Failed to fetch CMS data from ${endpoint}:`, error);
    throw error;
  }
}
