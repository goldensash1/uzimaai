import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'uzimaai_session';

export async function saveSession(user: any) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
}

export async function getSession() {
  const data = await SecureStore.getItemAsync(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
} 