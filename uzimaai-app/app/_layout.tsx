<<<<<<< HEAD
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import SplashScreen from './splash';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showSplash, setShowSplash] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowSplash(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen />;
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
=======
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import SplashScreen from './splash';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { getSession } from '../utils/session';
import { useRouter, usePathname } from 'expo-router';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showSplash, setShowSplash] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowSplash(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      setIsLoggedIn(!!session);
      setCheckingAuth(false);
      // If on /login and already logged in, redirect to main app
      if (session && pathname === '/login') {
        router.replace('/(tabs)');
      }
    }
    if (!showSplash && loaded) {
      checkAuth();
    }
  }, [showSplash, loaded, pathname]);

  useEffect(() => {
    if (!isLoggedIn && !checkingAuth && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login');
    }
  }, [isLoggedIn, checkingAuth, pathname, router]);

  if (!loaded) {
    return null;
  }
  if (showSplash) {
    return <SplashScreen />;
  }
  if (checkingAuth) {
    return null;
  }
  if (!isLoggedIn && pathname !== '/login' && pathname !== '/register') {
    return null; // Prevent rendering until navigation completes
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
>>>>>>> 3196057a72e6f7eed42b22472c818a30eea0078c
