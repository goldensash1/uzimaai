import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { apiRequest } from '../../utils/api';
import { API_ENDPOINTS } from '../../constants/api';

type Medicine = {
  medicineId: string;
  medicineName: string;
  medicineUses: string;
  medicineSideEffects: string;
  medicineAlternatives: string;
};

export default function MedicineScreen() {
  const [search, setSearch] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMedicines() {
      setLoading(true);
      setError('');
      try {
        const res = await apiRequest(API_ENDPOINTS.medicines);
        setMedicines(res.medicines);
      } catch (e: any) {
        setError(e.message || 'Failed to load medicines');
      } finally {
        setLoading(false);
      }
    }
    fetchMedicines();
  }, []);

  const filtered = medicines.filter(m => m.medicineName.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#377DFF" /></View>;
  }
  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search medicines..."
        placeholderTextColor="#B0B8C1"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.medicineId}
        renderItem={({ item }) => <MedicineCard medicine={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function MedicineCard({ medicine }: { medicine: Medicine }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(e => !e)}>
        <Text style={styles.medicineName}>{medicine.medicineName}</Text>
        <Text style={styles.label}>Uses:</Text>
        <Text style={styles.value}>{medicine.medicineUses}</Text>
        <Text style={styles.label}>Side Effects:</Text>
        <Text style={styles.value}>{medicine.medicineSideEffects}</Text>
        <Text style={styles.label}>Alternatives:</Text>
        <Text style={styles.value}>{medicine.medicineAlternatives}</Text>
        <Text style={styles.detailsBtn}>{expanded ? 'Hide Details' : 'View Details'}</Text>
      </TouchableOpacity>
      {/* Reviews can be fetched and displayed here if needed */}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medicineName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    color: '#7B8CA6',
    marginTop: 4,
  },
  value: {
    fontSize: 15,
    color: '#232B38',
    marginBottom: 2,
  },
  detailsBtn: {
    color: '#377DFF',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 15,
  },
  reviewsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 8,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
    color: '#232B38',
    fontSize: 15,
  },
  reviewText: {
    color: '#4A5568',
    fontSize: 14,
  },
  stars: {
    color: '#FFD700',
    fontSize: 16,
    marginLeft: 8,
  },
}); 