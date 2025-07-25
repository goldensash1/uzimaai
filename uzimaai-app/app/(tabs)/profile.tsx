import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { clearSession, getSession } from '../../utils/session';
import { useRouter } from 'expo-router';
import { apiRequest } from '../../utils/api';
import { API_ENDPOINTS } from '../../constants/api';
import { FontAwesome, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

const ACCOUNT = [
  { icon: <FontAwesome name="user" size={22} color="#377DFF" />, label: 'Edit Profile' },
  { icon: <Feather name="lock" size={22} color="#7B8CA6" />, label: 'Change Password' },
];
const HEALTH = [
  { icon: <MaterialIcons name="history" size={22} color="#2CD283" />, label: 'Symptom History' },
];
const APP = [
  { icon: <Ionicons name="settings-outline" size={22} color="#8B5CF6" />, label: 'App Settings' },
  { icon: <MaterialIcons name="logout" size={22} color="#E53935" />, label: 'Log Out', color: '#E53935' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    setError('');
    try {
      const session = await getSession();
      if (!session?.userid) throw new Error('No user session');
      const res = await apiRequest(`${API_ENDPOINTS.profile}?userid=${session.userid}`);
      setUser(res.user);
    } catch (e: any) {
      setError(e.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (label: string) => {
    if (label === 'Log Out') {
      await clearSession();
      router.replace('/login');
    } else if (label === 'Edit Profile') {
      setEditData({
        ...user,
        emergencyphone: user?.emergencyphone || '',
      });
      setEditError('');
      setEditVisible(true);
    } else {
      Alert.alert(label, 'This feature is coming soon.');
    }
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError('');
    try {
      await apiRequest(API_ENDPOINTS.updateProfile, 'POST', {
        userid: user.userid,
        username: editData.username,
        useremail: editData.useremail,
        phone: editData.phone,
        emergencyphone: editData.emergencyphone,
      });
      setEditVisible(false);
      fetchProfile();
    } catch (e: any) {
      setEditError(e.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#377DFF" /></View>;
  }
  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>{error}</Text></View>;
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <FontAwesome name="user-circle" size={84} color="#377DFF" style={styles.profileIcon} />
          <Text style={styles.name}>{user?.username || ''}</Text>
          <Text style={styles.email}>{user?.useremail || ''}</Text>
          <View style={styles.statsRow}>
            {/* Placeholder stats, replace with real data if available */}
            <View style={styles.statBox}><Text style={[styles.statValue, { color: '#377DFF' }]}>0</Text><Text style={styles.statLabel}>Symptoms</Text></View>
            <View style={styles.statBox}><Text style={[styles.statValue, { color: '#2CD283' }]}>0</Text><Text style={styles.statLabel}>Reviews</Text></View>
            <View style={styles.statBox}><Text style={[styles.statValue, { color: '#8B5CF6' }]}>0</Text><Text style={styles.statLabel}>Reports</Text></View>
          </View>
        </View>
        <Section title="Account">
          {ACCOUNT.map(item => (
            <ProfileAction key={item.label} icon={item.icon} label={item.label} onPress={handleAction} />
          ))}
        </Section>
        <Section title="Health Data">
          {HEALTH.map(item => (
            <ProfileAction key={item.label} icon={item.icon} label={item.label} onPress={handleAction} />
          ))}
        </Section>
        <Section title="App">
          {APP.map(item => (
            <ProfileAction key={item.label} icon={item.icon} label={item.label} color={item.color} onPress={handleAction} />
          ))}
        </Section>
      </ScrollView>
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editData.username}
              onChangeText={v => setEditData((d: any) => ({ ...d, username: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editData.useremail}
              onChangeText={v => setEditData((d: any) => ({ ...d, useremail: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={editData.phone}
              onChangeText={v => setEditData((d: any) => ({ ...d, phone: v }))}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Emergency Phone"
              value={editData.emergencyphone}
              onChangeText={v => setEditData((d: any) => ({ ...d, emergencyphone: v }))}
              keyboardType="phone-pad"
            />
            {editError ? <Text style={{ color: 'red', marginBottom: 8 }}>{editError}</Text> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#A0AEC0' }]} onPress={() => setEditVisible(false)} disabled={editLoading}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#377DFF' }]} onPress={handleEditSave} disabled={editLoading}>
                {editLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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

function ProfileAction({ icon, label, color, onPress }: { icon: React.ReactNode; label: string; color?: string; onPress: (label: string) => void }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={() => onPress(label)}>
      <View style={styles.actionIconBox}>{icon}</View>
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
    fontSize: 20,
    marginRight: 14,
  },
  actionIconBox: {
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#232B38',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#232B38',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  profileIcon: {
    marginBottom: 12,
    alignSelf: 'center',
  },
}); 