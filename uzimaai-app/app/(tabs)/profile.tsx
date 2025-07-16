import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const USER = {
  name: 'Salomon Masasu',
  email: 'salomon.masasu@email.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  stats: [
    { label: 'Symptoms', value: 24, color: '#377DFF' },
    { label: 'Reviews', value: 12, color: '#2CD283' },
    { label: 'Reports', value: 8, color: '#8B5CF6' },
  ],
};

const ACCOUNT = [
  { icon: '👤', label: 'Edit Profile' },
  { icon: '🔒', label: 'Change Password' },
];
const HEALTH = [
  { icon: '📈', label: 'Symptom History' },
];
const APP = [
  { icon: '⚙️', label: 'App Settings' },
  { icon: '🚪', label: 'Log Out', color: '#E53935' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: USER.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{USER.name}</Text>
        <Text style={styles.email}>{USER.email}</Text>
        <View style={styles.statsRow}>
          {USER.stats.map(stat => (
            <View key={stat.label} style={styles.statBox}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <Section title="Account">
        {ACCOUNT.map(item => (
          <ProfileAction key={item.label} icon={item.icon} label={item.label} />
        ))}
      </Section>
      <Section title="Health Data">
        {HEALTH.map(item => (
          <ProfileAction key={item.label} icon={item.icon} label={item.label} />
        ))}
      </Section>
      <Section title="App">
        {APP.map(item => (
          <ProfileAction key={item.label} icon={item.icon} label={item.label} color={item.color} />
        ))}
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ProfileAction({ icon, label, color }: { icon: string; label: string; color?: string }) {
  return (
    <TouchableOpacity style={styles.actionRow}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={[styles.actionLabel, color && { color }]}>{label}</Text>
      <Text style={styles.actionArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 2,
  },
  email: {
    color: '#7B8CA6',
    fontSize: 15,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  statLabel: {
    color: '#7B8CA6',
    fontSize: 14,
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#232B38',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    color: '#232B38',
    flex: 1,
  },
  actionArrow: {
    fontSize: 22,
    color: '#A0AEC0',
    marginLeft: 8,
  },
}); 