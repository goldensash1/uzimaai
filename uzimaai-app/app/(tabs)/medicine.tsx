import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';

const MEDICINES = [
  {
    id: '1',
    name: 'Paracetamol',
    uses: 'Pain relief, fever reduction, headaches',
    sideEffects: 'Nausea, stomach upset (rare)',
    alternatives: 'Ibuprofen, Aspirin',
    reviews: [
      { id: 'r1', user: 'Sarah M.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 4, text: 'Works great for headaches. No side effects experienced.' },
      { id: 'r2', user: 'John D.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5, text: 'Effective and safe. My go-to pain reliever.' },
    ],
  },
  {
    id: '2',
    name: 'Ibuprofen',
    uses: 'Anti-inflammatory, pain relief, fever reduction',
    sideEffects: 'Stomach irritation, dizziness',
    alternatives: 'Paracetamol, Naproxen',
    reviews: [
      { id: 'r3', user: 'Sarah M.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 4, text: 'No side effects. Helped with my pain.' },
    ],
  },
];

type Review = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  text: string;
};

type Medicine = {
  id: string;
  name: string;
  uses: string;
  sideEffects: string;
  alternatives: string;
  reviews: Review[];
};

export default function MedicineScreen() {
  const [search, setSearch] = useState('');
  const filtered = MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

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
        keyExtractor={item => item.id}
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
        <Text style={styles.medicineName}>{medicine.name}</Text>
        <Text style={styles.label}>Uses:</Text>
        <Text style={styles.value}>{medicine.uses}</Text>
        <Text style={styles.label}>Side Effects:</Text>
        <Text style={styles.value}>{medicine.sideEffects}</Text>
        <Text style={styles.label}>Alternatives:</Text>
        <Text style={styles.value}>{medicine.alternatives}</Text>
        <Text style={styles.detailsBtn}>{expanded ? 'Hide Details' : 'View Details'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>User Reviews</Text>
          {medicine.reviews.map((r: Review) => (
            <View key={r.id} style={styles.reviewRow}>
              <Image source={{ uri: r.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewUser}>{r.user}</Text>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
              <Text style={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</Text>
            </View>
          ))}
        </View>
      )}
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