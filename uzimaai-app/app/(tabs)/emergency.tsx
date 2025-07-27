import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, ScrollView, ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { API_ENDPOINTS } from '../../constants/api';
import { apiRequest } from '../../utils/api';
import { getSession } from '../../utils/session';
import CustomPicker from '../../components/CustomPicker';

interface EmergencyContact {
  contactId: number;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

const { width } = Dimensions.get('window');

const RELATIONSHIP_OPTIONS = [
  { label: 'Select Relationship', value: '' },
  { label: 'Spouse', value: 'Spouse' },
  { label: 'Parent', value: 'Parent' },
  { label: 'Child', value: 'Child' },
  { label: 'Sibling', value: 'Sibling' },
  { label: 'Friend', value: 'Friend' },
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Neighbor', value: 'Neighbor' },
  { label: 'Colleague', value: 'Colleague' },
  { label: 'Other', value: 'Other' },
];

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  });
  const [userid, setUserid] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.userid) {
        setUserid(session.userid);
        fetchContacts(session.userid);
      } else {
        setLoading(false);
        setError('Please log in to manage emergency contacts');
      }
    })();
  }, []);

  const fetchContacts = async (uid: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest(`${API_ENDPOINTS.emergencyContacts}?userid=${uid}`);
      setContacts(response.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleCallContact = (phone: string) => {
    Alert.alert(
      'Call Emergency Contact',
      `Call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${phone}`) }
      ]
    );
  };

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({ name: '', phone: '', relationship: '' });
    setModalVisible(true);
  };

  const openEditModal = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setModalVisible(true);
  };

  const saveContact = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.relationship) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!userid) {
      Alert.alert('Error', 'Please log in to save contacts');
      return;
    }

    try {
      const endpoint = editingContact ? API_ENDPOINTS.updateEmergencyContact : API_ENDPOINTS.addEmergencyContact;
      const data = editingContact 
        ? { ...formData, contactId: editingContact.contactId, userid }
        : { ...formData, userid };

      const response = await apiRequest(endpoint, 'POST', data);

      if (response.success) {
        setModalVisible(false);
        fetchContacts(userid);
        Alert.alert('Success', editingContact ? 'Contact updated successfully' : 'Contact added successfully');
      } else {
        Alert.alert('Error', response.error || 'Failed to save contact');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save contact');
    }
  };

  const deleteContact = async (contactId: number) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const response = await apiRequest(API_ENDPOINTS.deleteEmergencyContact, 'POST', { contactId, userid });
            if (response.success) {
              fetchContacts(userid!);
              Alert.alert('Success', 'Contact deleted successfully');
            } else {
              Alert.alert('Error', response.error || 'Failed to delete contact');
            }
          } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to delete contact');
          }
        }}
      ]
    );
  };

  const setPrimaryContact = async (contactId: number) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.setPrimaryEmergencyContact, 'POST', { contactId, userid });
      if (response.success) {
        fetchContacts(userid!);
        Alert.alert('Success', 'Primary contact updated successfully');
      } else {
        Alert.alert('Error', response.error || 'Failed to update primary contact');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update primary contact');
    }
  };

  const renderContact = ({ item }: { item: EmergencyContact }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
            <Text style={styles.contactRelationship}>{item.relationship}</Text>
          </View>
        </View>
        <View style={styles.contactActions}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCallContact(item.phone)}
          >
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="pencil" size={16} color="#377DFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.contactFooter}>
        {item.isPrimary ? (
          <View style={styles.primaryBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.primaryText}>Primary Contact</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.setPrimaryButton}
            onPress={() => setPrimaryContact(item.contactId)}
          >
            <Text style={styles.setPrimaryText}>Set as Primary</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteContact(item.contactId)}
        >
          <Ionicons name="trash" size={16} color="#E53E3E" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={32} color="#E53E3E" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Emergency Contacts</Text>
            <Text style={styles.subtitle}>Quick access to important contacts</Text>
          </View>
        </View>
      </View>

      {/* Emergency Call Button */}
      <TouchableOpacity style={styles.emergencyCallButton} onPress={() => Linking.openURL('tel:911')}>
        <View style={styles.emergencyCallContent}>
          <Ionicons name="warning" size={24} color="#fff" />
          <Text style={styles.emergencyCallText}>EMERGENCY - Call 911</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#377DFF" />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle" size={48} color="#E53E3E" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => userid && fetchContacts(userid)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.centered}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="people" size={64} color="#A0AEC0" />
          </View>
          <Text style={styles.emptyText}>No Emergency Contacts</Text>
          <Text style={styles.emptySubtext}>Add your important contacts for quick access during emergencies</Text>
          <TouchableOpacity style={styles.addFirstButton} onPress={openAddModal}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addFirstButtonText}>Add First Contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.contactsHeader}>
            <Text style={styles.contactsTitle}>Your Contacts ({contacts.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <Ionicons name="add" size={20} color="#377DFF" />
              <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={contacts}
            keyExtractor={item => item.contactId.toString()}
            renderItem={renderContact}
            contentContainerStyle={styles.contactsList}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#7B8CA6" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  style={styles.modalScroll}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter full name"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      returnKeyType="next"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChangeText={(text) => setFormData({ ...formData, phone: text })}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Relationship</Text>
                    <CustomPicker
                      value={formData.relationship}
                      onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                      items={RELATIONSHIP_OPTIONS}
                      placeholder="Select relationship"
                    />
                  </View>
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={saveContact}
                  >
                    <Text style={styles.saveButtonText}>
                      {editingContact ? 'Update' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
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
    backgroundColor: '#FED7D7',
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
  emergencyCallButton: {
    backgroundColor: '#E53E3E',
    margin: 20,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyCallContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyCallText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#718096',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#E53E3E',
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
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#377DFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFirstButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EBF4FF',
  },
  addButtonText: {
    color: '#377DFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  contactsList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  contactCard: {
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
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#377DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 2,
  },
  contactRelationship: {
    fontSize: 12,
    color: '#718096',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#48BB78',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#EBF4FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  primaryText: {
    fontSize: 12,
    color: '#D69E2E',
    fontWeight: '600',
    marginLeft: 4,
  },
  setPrimaryButton: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  setPrimaryText: {
    fontSize: 12,
    color: '#377DFF',
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FED7D7',
  },
  deleteText: {
    fontSize: 12,
    color: '#E53E3E',
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  modalScroll: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A202C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4A5568',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#377DFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 