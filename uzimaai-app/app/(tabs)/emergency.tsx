import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const CONTACTS = {
  primary: {
    id: '1',
    name: 'Sarah Johnson',
    relation: 'Mother',
    phone: '+1 (555) 123-4567',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  others: [
    {
      id: '2',
      name: 'Dr. Michael Chen',
      relation: 'Family Doctor',
      phone: '+1 (555) 987-6543',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    {
      id: '3',
      name: 'James Wilson',
      relation: 'Brother',
      phone: '+1 (555) 456-7890',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
  ],
};

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState(CONTACTS);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.emergencyBtn}>
        <Text style={styles.emergencyBtnText}>📞  Call Emergency Now</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Primary Contact</Text>
      <ContactCard contact={contacts.primary} primary />
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Other Contacts</Text>
        <TouchableOpacity>
          <Text style={styles.addNew}>Add New</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={contacts.others}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ContactCard contact={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ContactCard({ contact, primary }: { contact: any; primary?: boolean }) {
  return (
    <View style={[styles.contactCard, primary && styles.primaryCard]}>  
      <Image source={{ uri: contact.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactRelation}>{contact.relation}</Text>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
      </View>
      <View style={styles.actionsCol}>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.iconPhone}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.iconEdit}>✏️</Text>
        </TouchableOpacity>
        {primary ? (
          <View style={styles.primaryBadge}><Text style={styles.primaryBadgeText}>PRIMARY</Text></View>
        ) : (
          <TouchableOpacity>
            <Text style={styles.setPrimary}>Set Primary</Text>
          </TouchableOpacity>
        )}
      </View>
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
  emergencyBtn: {
    backgroundColor: '#E53935',
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 8,
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  addNew: {
    color: '#377DFF',
    fontWeight: 'bold',
    fontSize: 15,
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
    borderColor: '#E53935',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
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
  iconPhone: {
    fontSize: 22,
    color: '#2CD283',
  },
  iconEdit: {
    fontSize: 20,
    color: '#7B8CA6',
  },
  setPrimary: {
    color: '#377DFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 4,
  },
  primaryBadge: {
    backgroundColor: '#FFE6E6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  primaryBadgeText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 11,
  },
}); 