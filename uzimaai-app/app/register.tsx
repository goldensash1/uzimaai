import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';
import { apiRequest } from '../utils/api';
import { saveSession } from '../utils/session';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
    if (!username || !useremail || !phone || !password || !confirm) {
      setError('All fields are required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest(API_ENDPOINTS.register, 'POST', {
        username,
        useremail,
        phone,
        password,
      });
      // Auto-login after registration
      await saveSession({ userid: data.userid, username, useremail, phone });
      setLoading(false);
      router.replace('/(tabs)');
    } catch (e: any) {
      setLoading(false);
      setError(e.message || 'Registration failed');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
      <View style={styles.centered}>
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#A0AEC0"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0AEC0"
            value={useremail}
            onChangeText={setUseremail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#A0AEC0"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0AEC0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#A0AEC0"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />
        </View>
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Register</Text>}
        </TouchableOpacity>
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>
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
        <Text style={styles.signupText}>
          Already have an account? <Text style={styles.signupLink} onPress={() => router.replace('/login')}>Login</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

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
  registerBtn: {
    backgroundColor: '#2CD283',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    shadowColor: '#2CD283',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 18,
    color: '#7B8CA6',
    fontSize: 15,
  },
  loginLink: {
    color: '#377DFF',
    fontWeight: 'bold',
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