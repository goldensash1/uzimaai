import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '../../constants/api';
import { apiRequest } from '../../utils/api';
import { getSession } from '../../utils/session';

interface SymptomResponse {
  message: string;
  response: string;
  timestamp: string;
}

const { width } = Dimensions.get('window');

const COMMON_SYMPTOMS = [
  { id: 1, name: 'Headache', icon: 'medical', color: '#FFE6E6' },
  { id: 2, name: 'Fever', icon: 'thermometer', color: '#FFE6F0' },
  { id: 3, name: 'Cough', icon: 'medical', color: '#E6F0FF' },
  { id: 4, name: 'Fatigue', icon: 'bed-outline', color: '#E6FFF5' },
  { id: 5, name: 'Nausea', icon: 'medical-outline', color: '#FFF5E6' },
  { id: 6, name: 'Dizziness', icon: 'sync-outline', color: '#F0E6FF' },
  { id: 7, name: 'Chest Pain', icon: 'heart-outline', color: '#FFE6E6' },
  { id: 8, name: 'Back Pain', icon: 'body-outline', color: '#E6F0FF' },
];

export default function SymptomCheckerScreen() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<SymptomResponse[]>([]);
  const [userid, setUserid] = useState<number | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.userid) {
        setUserid(session.userid);
      }
    })();
  }, []);

  const addSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) return;
    
    const newSymptoms = symptoms ? `${symptoms}, ${symptom}` : symptom;
    setSymptoms(newSymptoms);
    setSelectedSymptom(symptom);
  };

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
        setSymptoms('');
        setSelectedSymptom('');
      } else {
        Alert.alert('Error', response.error || 'Failed to analyze symptoms');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  const clearSymptoms = () => {
    setSymptoms('');
    setSelectedSymptom('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="medical-services" size={32} color="#377DFF" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Symptom Checker</Text>
                <Text style={styles.subtitle}>AI-powered health insights</Text>
              </View>
            </View>
          </View>

          {/* Quick Symptoms Section */}
          <View style={styles.quickSymptomsSection}>
            <Text style={styles.sectionTitle}>Quick Symptoms</Text>
            <Text style={styles.sectionSubtitle}>Tap to add common symptoms</Text>
            
            <View style={styles.symptomsGrid}>
              {COMMON_SYMPTOMS.map((symptom) => (
                <TouchableOpacity
                  key={symptom.id}
                  style={[
                    styles.symptomChip,
                    { backgroundColor: symptom.color },
                    selectedSymptom === symptom.name && styles.symptomChipSelected
                  ]}
                  onPress={() => addSymptom(symptom.name)}
                >
                  <Ionicons 
                    name={symptom.icon as any} 
                    size={24} 
                    color={selectedSymptom === symptom.name ? '#377DFF' : '#64748B'} 
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={[
                    styles.symptomText,
                    selectedSymptom === symptom.name && styles.symptomTextSelected
                  ]}>
                    {symptom.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Describe Your Symptoms</Text>
              {symptoms.length > 0 && (
                <TouchableOpacity onPress={clearSymptoms} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#E53E3E" />
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Describe your symptoms in detail. For example: headache, fever, sore throat, fatigue..."
                placeholderTextColor="#A0AEC0"
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
                numberOfLines={4}
                editable={!loading}
              />
              <View style={styles.inputFooter}>
                <Text style={styles.characterCount}>{symptoms.length}/500</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
              onPress={checkSymptoms}
              disabled={loading || !symptoms.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="analytics" size={20} color="#fff" />
                  <Text style={styles.analyzeButtonText}>Analyze Symptoms</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Results Section */}
          {responses.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.sectionTitle}>Analysis Results</Text>
              {responses.map((response, index) => (
                <View key={index} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View style={styles.resultIcon}>
                      <Ionicons name="medical" size={20} color="#377DFF" />
                    </View>
                    <Text style={styles.resultTitle}>AI Analysis</Text>
                    <Text style={styles.resultTime}>
                      {new Date(response.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  
                  <View style={styles.resultContent}>
                    <Text style={styles.symptomQuery}>"{response.message}"</Text>
                    <Text style={styles.aiResponse}>{response.response}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle" size={20} color="#718096" />
            <Text style={styles.disclaimerText}>
              This is for informational purposes only. Always consult a healthcare professional for medical advice.
            </Text>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  quickSymptomsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 20,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomChip: {
    width: (width - 60) / 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  symptomChipSelected: {
    backgroundColor: '#377DFF',
    transform: [{ scale: 1.05 }],
  },

  symptomText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
  },
  symptomTextSelected: {
    color: '#fff',
  },
  inputSection: {
    padding: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#E53E3E',
    marginLeft: 4,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#1A202C',
    lineHeight: 24,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  characterCount: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  analyzeButton: {
    backgroundColor: '#377DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#377DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultsSection: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
    flex: 1,
  },
  resultTime: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  resultContent: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
  },
  symptomQuery: {
    fontSize: 14,
    color: '#4A5568',
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 20,
  },
  aiResponse: {
    fontSize: 15,
    color: '#1A202C',
    lineHeight: 22,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#EBF8FF',
    margin: 20,
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#2B6CB0',
    marginLeft: 8,
    lineHeight: 20,
    flex: 1,
  },
});
