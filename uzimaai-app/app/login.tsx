import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';
import { apiRequest } from '../utils/api';
import { saveSession } from '../utils/session';

/**
 * LoginScreen provides a user interface for users to log in to their health account.
 * It handles authentication, error display, and navigation to the main app or registration.
 */
export default function LoginScreen() {
  // State variables for user input and UI feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  /**
   * Handles the login process:
   * - Sends login credentials to the API
   * - Saves user session on success
   * - Navigates to main app tabs
   * - Displays error on failure
   */
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest(API_ENDPOINTS.login, 'POST', {
        identifier: email,
        password,
      });
      await saveSession(data.user);
      setLoading(false);
      router.replace('/(tabs)'); // Go to main app
    } catch (e: any) {
      setLoading(false);
      // Provide more specific error messages
      if (e.message.includes('Cannot connect to server')) {
        setError('Connection failed. Please check if XAMPP is running and your IP address is correct.');
      } else if (e.message.includes('Invalid credentials')) {
        setError('Invalid email/phone or password. Please try again.');
      } else if (e.message.includes('Missing required fields')) {
        setError('Please enter both email/phone and password.');
      } else {
        setError(e.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.centered}>
        {/* App logo */}
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        {/* Welcome message */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your health account</Text>
        {/* Input fields for email and password */}
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Email or Phone Number"
            placeholderTextColor="#A0AEC0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0AEC0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {/* Error message display */}
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        {/* Login button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Login</Text>}
        </TouchableOpacity>
        {/* Forgot password link */}
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        {/* Divider for social login */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>
        {/* Social login buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}></Text>
            <Text style={styles.socialText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>
        {/* Link to registration screen */}
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text style={styles.signupLink} onPress={() => router.replace('/register')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

/**
 * Styles for the LoginScreen components.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7B8CA6',
    marginBottom: 24,
  },
  inputBox: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#232B38',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loginBtn: {
    backgroundColor: '#377DFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    shadowColor: '#377DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgot: {
    color: '#377DFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 18,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#A0AEC0',
    fontWeight: 'bold',
  },
  socialRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  socialText: {
    fontSize: 16,
    color: '#232B38',
  },
  signupText: {
    marginTop: 18,
    color: '#7B8CA6',
    fontSize: 15,
  },
  signupLink: {
    color: '#377DFF',
    fontWeight: 'bold',
  },
});