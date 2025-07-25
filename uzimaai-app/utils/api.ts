import { API_ENDPOINTS } from '../constants/api';

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

  const res = await fetch(endpoint, options);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('Invalid server response');
  }
  if (!res.ok || data.error) {
    throw new Error(data.error || 'API error');
  }
  return data;
} 