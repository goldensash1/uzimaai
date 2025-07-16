import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { apiRequest } from '../../utils/api';
import { API_ENDPOINTS } from '../../constants/api';
import { getSession } from '../../utils/session';

// Define a type for EmergencyContact
interface EmergencyContact {
  contactId: number;
  UserId: number;
  PhoneNumber: string;
  Relationship: string;
  ContactName: string;
  updatedDate: string;
  contactStatus: number;
}

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editContact, setEditContact] = useState<EmergencyContact | null>(null);
  const [form, setForm] = useState({ PhoneNumber: '', Relationship: '', ContactName: '' });
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      setUserId(session?.userid);
      fetchContacts(session?.userid);
    })();
  }, []);

  async function fetchContacts(uid: number) {
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest(`${API_ENDPOINTS.emergencyContacts}?UserId=${uid}`);
      setContacts(res.contacts);
    } catch (e: any) {
      setError(e.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditContact(null);
    setForm({ PhoneNumber: '', Relationship: '', ContactName: '' });
    setModalVisible(true);
  }

  function openEditModal(contact: EmergencyContact) {
    setEditContact(contact);
    setForm({
      PhoneNumber: contact.PhoneNumber,
      Relationship: contact.Relationship,
      ContactName: contact.ContactName,
    });
    setModalVisible(true);
  }

  async function handleSave() {
    if (!form.PhoneNumber || !form.Relationship || !form.ContactName) {
      Alert.alert('All fields are required');
      return;
    }
    setSaving(true);
    try {
      if (editContact) {
        await apiRequest(API_ENDPOINTS.updateEmergencyContact, 'POST', {
          contactId: editContact.contactId,
          ...form,
        });
      } else {
        await apiRequest(API_ENDPOINTS.addEmergencyContact, 'POST', {
          UserId: userId,
          ...form,
        });
      }
      setModalVisible(false);
      fetchContacts(userId!);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contactId: number) {
    Alert.alert('Delete Contact', 'Are you sure you want to delete this contact?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await apiRequest(API_ENDPOINTS.deleteEmergencyContact, 'POST', { contactId });
          fetchContacts(userId!);
        } catch (e: any) {
          Alert.alert('Error', e.message || 'Failed to delete contact');
        }
      }},
    ]);
  }

  async function handleSetPrimary(contactId: number) {
    try {
      await apiRequest(API_ENDPOINTS.setPrimaryEmergencyContact, 'POST', { UserId: userId, contactId });
      fetchContacts(userId!);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to set primary contact');
    }
  }

  function renderContact({ item }: { item: EmergencyContact }) {
    const isPrimary = item.contactStatus === 2;
    return (
      <View style={[styles.contactCard, isPrimary && styles.primaryCard]}>  
        <View style={{ flex: 1 }}>
          <Text style={styles.contactName}>{item.ContactName}</Text>
          <Text style={styles.contactRelation}>{item.Relationship}</Text>
          <Text style={styles.contactPhone}>{item.PhoneNumber}</Text>
        </View>
        <View style={styles.actionsCol}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => {/* Call action */}}>
            <Ionicons name="call" size={22} color="#2CD283" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => openEditModal(item)}>
            <MaterialIcons name="edit" size={22} color="#7B8CA6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item.contactId)}>
            <MaterialIcons name="delete" size={22} color="#E53935" />
          </TouchableOpacity>
          {isPrimary ? (
            <View style={styles.primaryBadge}><Text style={styles.primaryBadgeText}>PRIMARY</Text></View>
          ) : (
            <TouchableOpacity onPress={() => handleSetPrimary(item.contactId)}>
              <FontAwesome name="star-o" size={20} color="#377DFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>
      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#377DFF" /></View>
      ) : error ? (
        <View style={styles.centered}><Text style={{ color: 'red' }}>{error}</Text></View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={item => item.contactId.toString()}
          renderItem={renderContact}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={openAddModal} activeOpacity={0.85}>
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.fabLabel}>Add Contact</Text>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editContact ? 'Edit Contact' : 'Add Contact'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Contact Name"
              value={form.ContactName}
              onChangeText={v => setForm(f => ({ ...f, ContactName: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Relationship"
              value={form.Relationship}
              onChangeText={v => setForm(f => ({ ...f, Relationship: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={form.PhoneNumber}
              onChangeText={v => setForm(f => ({ ...f, PhoneNumber: v }))}
              keyboardType="phone-pad"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#A0AEC0' }]} onPress={() => setModalVisible(false)} disabled={saving}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#377DFF' }]} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editContact ? 'Save' : 'Add'}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 18,
    alignSelf: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryCard: {
    borderWidth: 2,
    borderColor: '#377DFF',
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#232B38',
  },
  contactRelation: {
    color: '#7B8CA6',
    fontSize: 14,
  },
  contactPhone: {
    color: '#232B38',
    fontSize: 14,
    marginTop: 2,
  },
  actionsCol: {
    alignItems: 'center',
    marginLeft: 10,
  },
  iconBtn: {
    marginBottom: 8,
  },
  primaryBadge: {
    backgroundColor: '#377DFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  primaryBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 56,
    backgroundColor: '#377DFF',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#377DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 10,
  },
  fabLabel: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    color: '#377DFF',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    zIndex: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 28,
    width: '92%',
    shadowColor: '#377DFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 16,
    alignSelf: 'center',
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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 4,
  },
}); 