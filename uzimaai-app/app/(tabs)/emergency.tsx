import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { apiRequest } from '../../utils/api';
import { API_ENDPOINTS } from '../../constants/api';
import { getSession } from '../../utils/session';
import CustomPicker from '../../components/CustomPicker';

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

// Relationship options for dropdown
const RELATIONSHIP_OPTIONS = [
  { label: 'Select Relationship', value: '' },
  { label: 'Spouse/Partner', value: 'Spouse/Partner' },
  { label: 'Parent', value: 'Parent' },
  { label: 'Child', value: 'Child' },
  { label: 'Sibling', value: 'Sibling' },
  { label: 'Friend', value: 'Friend' },
  { label: 'Colleague', value: 'Colleague' },
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Neighbor', value: 'Neighbor' },
  { label: 'Other', value: 'Other' },
];

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

  const handleCallContact = (phoneNumber: string, contactName: string) => {
    Alert.alert(
      'Call Contact',
      `Call ${contactName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            const phoneUrl = `tel:${phoneNumber}`;
            Linking.canOpenURL(phoneUrl).then(supported => {
              if (supported) {
                Linking.openURL(phoneUrl);
              } else {
                Alert.alert('Error', 'Cannot make phone calls on this device');
              }
            });
          }
        }
      ]
    );
  };

  function renderContact({ item }: { item: EmergencyContact }) {
    const isPrimary = item.contactStatus === 2;
    return (
      <View style={[styles.contactCard, isPrimary && styles.primaryCard]}>  
        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>{item.ContactName}</Text>
          <Text style={styles.contactRelation} numberOfLines={1}>{item.Relationship}</Text>
          <Text style={styles.contactPhone} numberOfLines={1}>{item.PhoneNumber}</Text>
          {isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>PRIMARY</Text>
            </View>
          )}
        </View>
        <View style={styles.actionsCol}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => handleCallContact(item.PhoneNumber, item.ContactName)}
          >
            <Ionicons name="call" size={22} color="#2CD283" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => openEditModal(item)}>
            <MaterialIcons name="edit" size={22} color="#7B8CA6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item.contactId)}>
            <MaterialIcons name="delete" size={22} color="#E53935" />
          </TouchableOpacity>
          {!isPrimary && (
            <TouchableOpacity style={styles.iconBtn} onPress={() => handleSetPrimary(item.contactId)}>
              <FontAwesome name="star-o" size={20} color="#377DFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <Text style={styles.subtitle}>Manage your emergency contacts</Text>
      </View>
      
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#377DFF" />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle" size={48} color="#E53935" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchContacts(userId!)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="people" size={64} color="#A0AEC0" />
          <Text style={styles.emptyText}>No emergency contacts</Text>
          <Text style={styles.emptySubtext}>Add your first emergency contact below</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={item => item.contactId.toString()}
          renderItem={renderContact}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity style={styles.fab} onPress={openAddModal} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
            <CustomPicker
              value={form.Relationship}
              onValueChange={(value: string) => setForm(f => ({ ...f, Relationship: value }))}
              items={RELATIONSHIP_OPTIONS}
              placeholder="Select Relationship"
              style={styles.pickerContainer}
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
    paddingBottom: 100, // Add padding for tab bar
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7B8CA6',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7B8CA6',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#E53935',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#377DFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232B38',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#7B8CA6',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
  listHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listHeaderText: {
    fontSize: 14,
    color: '#7B8CA6',
    fontWeight: '600',
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
  contactInfo: {
    flex: 1,
    marginRight: 12,
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
  pickerContainer: {
    marginBottom: 12,
  },
}); 