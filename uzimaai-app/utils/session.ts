import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'uzimaai_session';

export async function saveSession(user: any) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
  }
}

export async function getSession() {
  let data;
  if (Platform.OS === 'web') {
    data = await AsyncStorage.getItem(SESSION_KEY);
  } else {
    data = await SecureStore.getItemAsync(SESSION_KEY);
  }
  return data ? JSON.parse(data) : null;
}

export async function clearSession() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(SESSION_KEY);
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
} 