import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '../../constants/api';
import { apiRequest } from '../../utils/api';
import { getSession } from '../../utils/session';

interface SymptomResponse {
  message: string;
  response: string;
  timestamp: string;
}

export default function SymptomCheckerScreen() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<SymptomResponse[]>([]);
  const [userid, setUserid] = useState<number | null>(null);

  useEffect(() => {
    // Get user session
    (async () => {
      const session = await getSession();
      if (session?.userid) {
        setUserid(session.userid);
      }
    })();
  }, []);

  const checkSymptoms = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please describe your symptoms');
      return;
    }

    if (!userid) {
      Alert.alert('Error', 'Please log in to use this feature');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(
        API_ENDPOINTS.aiChat, 
        'POST', 
        {
          message: symptoms,
          userid: userid,
          type: 'symptom'
        }
      );

      if (response.success) {
        const newResponse: SymptomResponse = {
          message: response.message,
          response: response.response,
          timestamp: response.timestamp
        };
        setResponses(prev => [newResponse, ...prev]);
        setSymptoms(''); // Clear input after successful response
      } else {
        Alert.alert('Error', response.error || 'Failed to analyze symptoms');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image source={require('../../assets/images/icon.png')} style={styles.icon} />
            <Text style={styles.title}>Describe Your Symptoms</Text>
            <Text style={styles.description}>
              Tell us about your symptoms and get AI-powered insights to help you understand your condition better.
            </Text>
          </View>
          
          <Text style={styles.inputLabel}>Enter your symptoms...</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe your symptoms in detail. For example: headache, fever, sore throat, fatigue..."
            placeholderTextColor="#B0B8C1"
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={5}
            editable={!loading}
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={checkSymptoms}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Check My Symptoms</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Display AI Responses */}
          {responses.length > 0 && (
            <View style={styles.responsesContainer}>
              <Text style={styles.responsesTitle}>Recent Analysis</Text>
              {responses.map((response, index) => (
                <View key={index} style={styles.responseCard}>
                  <View style={styles.responseHeader}>
                    <Text style={styles.responseLabel}>Your Symptoms:</Text>
                    <Text style={styles.responseTime}>{new Date(response.timestamp).toLocaleTimeString()}</Text>
                  </View>
                  <Text style={styles.userMessage}>{response.message}</Text>
                  
                  <View style={styles.aiResponseContainer}>
                    <Text style={styles.responseLabel}>AI Analysis:</Text>
                    <Text style={styles.aiResponse}>{response.response}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#7B8CA6',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#232B38',
    minHeight: 100,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  button: {
    backgroundColor: '#377DFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#377DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  responsesContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  responsesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 16,
  },
  responseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  responseTime: {
    fontSize: 12,
    color: '#718096',
  },
  userMessage: {
    fontSize: 15,
    color: '#2D3748',
    backgroundColor: '#E6F0FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  aiResponseContainer: {
    backgroundColor: '#F0FFF4',
    padding: 12,
    borderRadius: 8,
  },
  aiResponse: {
    fontSize: 15,
    color: '#2D3748',
    lineHeight: 22,
  },
});
