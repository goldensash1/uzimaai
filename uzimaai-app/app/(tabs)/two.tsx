import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function SymptomCheckerScreen() {
  const [symptoms, setSymptoms] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
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
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🔍  Check My Symptoms</Text>
        </TouchableOpacity>
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
