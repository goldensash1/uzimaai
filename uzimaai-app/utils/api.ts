import { API_ENDPOINTS, FALLBACK_URLS } from '../constants/api';

export async function apiRequest(endpoint: string, method = 'GET', body?: any, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options: RequestInit = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  let lastError: Error | null = null;

  // Try the main endpoint first, then fallbacks
  const urlsToTry = [endpoint, ...FALLBACK_URLS.map(base => endpoint.replace(API_ENDPOINTS.login.split('/endpoints')[0], base))];
  
  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, options);
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Invalid server response - server may be down or IP address may have changed');
      }
      
      if (!res.ok || data.error) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      return data;
    } catch (e: any) {
      lastError = e;
      // If it's a network error, try the next URL
      if (e.message.includes('fetch') || e.message.includes('network') || e.message.includes('Failed to fetch')) {
        continue;
      }
      // If it's a server error (like 401, 400, etc.), don't try other URLs
      break;
    }
  }

  // If we get here, all URLs failed
  if (lastError?.message.includes('Invalid server response') || lastError?.message.includes('fetch')) {
    throw new Error('Cannot connect to server. Please check:\n1. XAMPP is running\n2. IP address is correct\n3. Network connection is stable');
  }
  
  throw lastError || new Error('API request failed');
} 