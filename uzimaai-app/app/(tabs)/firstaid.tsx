import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Modal, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { apiRequest } from '../../utils/api';
import { API_ENDPOINTS } from '../../constants/api';

interface FirstAidPractice {
  id: number;
  title: string;
  description: string;
  steps: string[];
  category: string;
  severity: string;
  image_url?: string;
  created_at: string;
}

const SEVERITY_COLORS = {
  'Critical': '#E53935',
  'High': '#FF9800',
  'Medium': '#FFC107',
  'Low': '#4CAF50'
};

const CATEGORIES = [
  'All',
  'Emergency',
  'Wound Care',
  'Burns',
  'Injuries',
  'Environmental',
  'Neurological',
  'Allergic',
  'Poisoning',
  'Eye Care',
  'Minor Injuries',
  'Dental',
  'Animal Bites'
];

export default function FirstAidScreen() {
  const [practices, setPractices] = useState<FirstAidPractice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPractice, setSelectedPractice] = useState<FirstAidPractice | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPractices();
  }, []);

  const fetchPractices = async () => {
    setLoading(true);
    setError('');
    try {
      const category = selectedCategory === 'All' ? null : selectedCategory;
      const url = category 
        ? `${API_ENDPOINTS.firstAidPractices}?category=${encodeURIComponent(category)}`
        : API_ENDPOINTS.firstAidPractices;
      
      const response = await apiRequest(url);
      setPractices(response.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load first aid practices');
    } finally {
      setLoading(false);
    }
  };

  const filteredPractices = practices.filter(practice =>
    practice.title.toLowerCase().includes(search.toLowerCase()) ||
    practice.description.toLowerCase().includes(search.toLowerCase()) ||
    practice.category.toLowerCase().includes(search.toLowerCase())
  );

  const openPracticeDetail = (practice: FirstAidPractice) => {
    setSelectedPractice(practice);
    setModalVisible(true);
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'Call 911 for immediate emergency assistance?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 911', style: 'destructive', onPress: () => {
          // This would integrate with phone calling functionality
          Alert.alert('Emergency', 'Please call 911 immediately for emergency assistance.');
        }}
      ]
    );
  };

  const renderPracticeCard = ({ item }: { item: FirstAidPractice }) => (
    <TouchableOpacity 
      style={styles.practiceCard} 
      onPress={() => openPracticeDetail(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.severityBadge}>
          <Text style={[styles.severityText, { color: SEVERITY_COLORS[item.severity as keyof typeof SEVERITY_COLORS] }]}>
            {item.severity}
          </Text>
        </View>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      
      <Text style={styles.practiceTitle}>{item.title}</Text>
      <Text style={styles.practiceDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.stepsPreview}>
          <Text style={styles.stepsText}>
            {item.steps.length} steps
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#7B8CA6" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Modern Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="health-and-safety" size={32} color="#377DFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>First Aid Guide</Text>
            <Text style={styles.subtitle}>Emergency procedures and first aid practices</Text>
          </View>
        </View>
      </View>

      {/* Emergency Call Button */}
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <View style={styles.emergencyIcon}>
          <Ionicons name="call" size={20} color="#fff" />
        </View>
        <Text style={styles.emergencyButtonText}>EMERGENCY - Call 911</Text>
        <Ionicons name="chevron-forward" size={16} color="#fff" />
      </TouchableOpacity>

      <TextInput
        style={styles.search}
        placeholder="Search first aid practices..."
        placeholderTextColor="#B0B8C1"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Quick Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => {
                setSelectedCategory(category);
                fetchPractices();
              }}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#377DFF" />
          <Text style={styles.loadingText}>Loading first aid practices...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle" size={48} color="#E53935" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPractices}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredPractices.length === 0 ? (
        <View style={styles.centered}>
          <MaterialIcons name="medical-services" size={64} color="#A0AEC0" />
          <Text style={styles.emptyText}>No practices found</Text>
          <Text style={styles.emptySubtext}>Try a different search term or category</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPractices}
          keyExtractor={item => item.id.toString()}
          renderItem={renderPracticeCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPractice && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPractice.title}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#7B8CA6" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalScroll}>
                  <View style={styles.severityContainer}>
                    <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[selectedPractice.severity as keyof typeof SEVERITY_COLORS] + '20' }]}>
                      <Text style={[styles.severityText, { color: SEVERITY_COLORS[selectedPractice.severity as keyof typeof SEVERITY_COLORS] }]}>
                        {selectedPractice.severity}
                      </Text>
                    </View>
                    <Text style={styles.categoryText}>{selectedPractice.category}</Text>
                  </View>
                  
                  <Text style={styles.modalDescription}>{selectedPractice.description}</Text>
                  
                  <Text style={styles.stepsTitle}>Steps:</Text>
                  {selectedPractice.steps.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}
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
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
  },
  emergencyButton: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  search: {
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: '#232B38',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 4,
  },
  categoryChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginHorizontal: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: '#377DFF',
    borderColor: '#377DFF',
    shadowColor: '#377DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryChipText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '700',
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
    paddingBottom: 20,
  },
  practiceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 12,
    color: '#7B8CA6',
    fontWeight: '500',
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 8,
  },
  practiceDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsPreview: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepsText: {
    fontSize: 12,
    color: '#377DFF',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
    color: '#232B38',
    flex: 1,
    marginRight: 16,
  },
  modalScroll: {
    padding: 20,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232B38',
    marginBottom: 12,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    backgroundColor: '#377DFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    flex: 1,
  },
}); 