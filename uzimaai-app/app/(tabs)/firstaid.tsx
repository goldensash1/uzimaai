import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';

const EMERGENCIES = [
  { id: '1', label: 'Burns', desc: 'Heat, chemical, electrical', icon: '🔥', color: '#FFE6E6' },
  { id: '2', label: 'Cuts', desc: 'Minor to severe wounds', icon: '✂️', color: '#FFE6F0' },
  { id: '3', label: 'Fainting', desc: 'Loss of consciousness', icon: '😵', color: '#E6F0FF' },
  { id: '4', label: 'Choking', desc: 'Airway obstruction', icon: '🫁', color: '#E6FFF5' },
];

const TIPS = [
  { id: '1', title: 'Stay Calm', desc: 'Take a deep breath and assess the situation before acting.', icon: '💡', color: '#E6FFF5' },
  { id: '2', title: 'Safety First', desc: 'Ensure your safety before helping others.', icon: '🛡️', color: '#E6F0FF' },
];

export default function FirstAidScreen() {
  const [search, setSearch] = useState('');
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <TextInput
        style={styles.search}
        placeholder="Search first aid topics..."
        placeholderTextColor="#B0B8C1"
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>❗ Emergency? Call 911 immediately{`\n`}For life-threatening situations</Text>
      </View>
      <Text style={styles.sectionTitle}>Common Emergencies</Text>
      <View style={styles.gridRow}>
        {EMERGENCIES.map(e => (
          <View key={e.id} style={[styles.emergencyCard, { backgroundColor: e.color }]}> 
            <Text style={styles.emergencyIcon}>{e.icon}</Text>
            <Text style={styles.emergencyLabel}>{e.label}</Text>
            <Text style={styles.emergencyDesc}>{e.desc}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Quick Tips</Text>
      {TIPS.map(tip => (
        <View key={tip.id} style={[styles.tipCard, { backgroundColor: tip.color }]}> 
          <Text style={styles.tipIcon}>{tip.icon}</Text>
          <View>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDesc}>{tip.desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  search: {
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: '#232B38',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  warningBox: {
    backgroundColor: '#FFE6E6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  warningText: {
    color: '#E53935',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 10,
    marginTop: 8,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  emergencyCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emergencyLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#232B38',
    marginBottom: 2,
  },
  emergencyDesc: {
    color: '#7B8CA6',
    fontSize: 14,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  tipTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#232B38',
    marginBottom: 2,
  },
  tipDesc: {
    color: '#4A5568',
    fontSize: 14,
  },
}); 