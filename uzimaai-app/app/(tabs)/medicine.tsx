import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal, 
  Alert, 
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { apiRequest } from '../../utils/api';
import { API_ENDPOINTS } from '../../constants/api';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { getSession } from '../../utils/session';

const { width } = Dimensions.get('window');

// Utility function to render stars
const renderStars = (rating: number, size: number = 16) => {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={`star-${star}-${rating}`}
          name={star <= rating ? "star" : "star-outline"}
          size={size}
          color="#FFD700"
        />
      ))}
    </View>
  );
};

type Medicine = {
  medicineId: string;
  medicineName: string;
  medicineUses: string;
  medicineSideEffects: string;
  medicineAlternatives: string;
};

type Review = {
  reviewId: number;
  userId: number;
  username: string;
  message: string;
  rating: number;
  reviewDate: string;
};

export default function MedicineScreen() {
  const [search, setSearch] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [reviews, setReviews] = useState<{ [medicineId: string]: Review[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userid, setUserid] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState<{ [medicineId: string]: boolean }>({});

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.userid) {
        setUserid(session.userid);
      }
    })();
    fetchMedicines();
  }, []);

  async function fetchMedicines() {
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest(API_ENDPOINTS.medicines);
      setMedicines(res.medicines || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  }

  const fetchReviewsForMedicine = async (medicineId: string) => {
    setLoadingReviews(prev => ({ ...prev, [medicineId]: true }));
    try {
      const reviewsRes = await apiRequest(`${API_ENDPOINTS.getMedicineReviews}?medicineId=${medicineId}`);
      if (reviewsRes.success) {
        setReviews(prev => ({
          ...prev,
          [medicineId]: reviewsRes.reviews || []
        }));
      }
    } catch (e) {
      console.log('Failed to load reviews for medicine:', medicineId, e);
      setReviews(prev => ({
        ...prev,
        [medicineId]: []
      }));
    } finally {
      setLoadingReviews(prev => ({ ...prev, [medicineId]: false }));
    }
  };

  const filtered = medicines.filter(m => m.medicineName.toLowerCase().includes(search.toLowerCase()));

  const openReviewModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setReviewMessage('');
    setReviewRating(5);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedMedicine || !userid || !reviewMessage.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await apiRequest(API_ENDPOINTS.addMedicineReview, 'POST', {
        UserId: userid,
        medicineId: selectedMedicine.medicineId,
        ReviewMessage: reviewMessage,
        rating: reviewRating
      });

      if (response.success) {
        Alert.alert('Success', 'Review submitted successfully');
        setShowReviewModal(false);
        setReviewMessage('');
        setReviewRating(5);
        
        // Force refresh reviews for this medicine and clear cache
        setReviews(prev => ({
          ...prev,
          [selectedMedicine.medicineId]: [] // Clear existing reviews to force reload
        }));
        await fetchReviewsForMedicine(selectedMedicine.medicineId);
        
        // Auto-expand the reviews section for the medicine that was just reviewed
        // This will be handled by the MedicineCard component
      } else {
        Alert.alert('Error', response.error || 'Failed to submit review');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };



  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#377DFF" />
        <Text style={styles.loadingText}>Loading medicines...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#E53E3E" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMedicines}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modern Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="medical-services" size={32} color="#377DFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Medicine Database</Text>
            <Text style={styles.subtitle}>Search and learn about medicines</Text>
          </View>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
        <TextInput
          style={styles.search}
          placeholder="Search medicines..."
          placeholderTextColor="#A0AEC0"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearch}>
            <Ionicons name="close-circle" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        )}
      </View>
      
      {filtered.length === 0 && search.length > 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="search-off" size={64} color="#A0AEC0" />
          <Text style={styles.emptyText}>No medicines found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.medicineId}
          renderItem={({ item }) => (
            <MedicineCard 
              medicine={item} 
              reviews={reviews[item.medicineId] || []}
              loadingReviews={loadingReviews[item.medicineId] || false}
              onAddReview={() => openReviewModal(item)}
              onLoadReviews={() => fetchReviewsForMedicine(item.medicineId)}
              autoExpandReviews={selectedMedicine?.medicineId === item.medicineId}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                {filtered.length} medicine{filtered.length !== 1 ? 's' : ''} found
              </Text>
            </View>
          }
        />
      )}

      {/* Review Modal */}
      <Modal visible={showReviewModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Review</Text>
                  <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                    <Ionicons name="close" size={24} color="#7B8CA6" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  style={styles.modalBody}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.modalSubtitle}>{selectedMedicine?.medicineName}</Text>
                  
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Rating:</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={`modal-star-${star}`}
                          onPress={() => setReviewRating(star)}
                          style={styles.starButton}
                        >
                          <Ionicons
                            name={star <= reviewRating ? "star" : "star-outline"}
                            size={28}
                            color="#FFD700"
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  <TextInput
                    style={styles.reviewInput}
                    placeholder="Share your experience with this medicine..."
                    placeholderTextColor="#A0AEC0"
                    value={reviewMessage}
                    onChangeText={setReviewMessage}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    textAlignVertical="top"
                  />
                  
                  <Text style={styles.characterCount}>
                    {reviewMessage.length}/500 characters
                  </Text>
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setShowReviewModal(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.submitButton, !reviewMessage.trim() && styles.submitButtonDisabled]} 
                    onPress={submitReview}
                    disabled={submittingReview || !reviewMessage.trim()}
                  >
                    {submittingReview ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit Review</Text>
                    )}
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

function MedicineCard({ 
  medicine, 
  reviews, 
  loadingReviews, 
  onAddReview, 
  onLoadReviews,
  autoExpandReviews = false
}: { 
  medicine: Medicine; 
  reviews: Review[];
  loadingReviews: boolean;
  onAddReview: () => void;
  onLoadReviews: () => void;
  autoExpandReviews?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  return (
    <View style={styles.card}>
      {/* Medicine Info Section */}
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View style={styles.medicineHeader}>
          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName} numberOfLines={2}>{medicine.medicineName}</Text>
            {reviews.length > 0 && (
              <View style={styles.ratingInfo}>
                {renderStars(Math.round(averageRating), 14)}
                <Text style={styles.ratingText}>
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </Text>
              </View>
            )}
          </View>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#A0AEC0" 
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialIcons name="healing" size={16} color="#377DFF" />
              <Text style={styles.infoLabel}>Uses:</Text>
            </View>
            <Text style={styles.infoValue}>{medicine.medicineUses}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialIcons name="warning" size={16} color="#FF9800" />
              <Text style={styles.infoLabel}>Side Effects:</Text>
            </View>
            <Text style={styles.infoValue}>{medicine.medicineSideEffects}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialIcons name="swap-horiz" size={16} color="#4CAF50" />
              <Text style={styles.infoLabel}>Alternatives:</Text>
            </View>
            <Text style={styles.infoValue}>{medicine.medicineAlternatives}</Text>
          </View>
        </View>
      )}

      {/* Reviews Section */}
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsHeader}>
          <TouchableOpacity 
            style={styles.reviewsTitleButton}
            onPress={() => {
              if (!showReviews) {
                onLoadReviews();
              }
              setShowReviews(!showReviews);
            }}
          >
            <Text style={styles.reviewsTitle}>
              Reviews ({reviews.length})
            </Text>
            <Ionicons 
              name={showReviews ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#377DFF" 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addReviewButton} onPress={onAddReview}>
            <Ionicons name="add-circle" size={20} color="#377DFF" />
            <Text style={styles.addReviewText}>Add Review</Text>
          </TouchableOpacity>
        </View>
        
        {showReviews && (
          <View style={styles.reviewsContent}>
            {loadingReviews ? (
              <View style={styles.loadingReviews}>
                <ActivityIndicator size="small" color="#377DFF" />
                <Text style={styles.loadingReviewsText}>Loading reviews...</Text>
              </View>
            ) : reviews.length > 0 ? (
              reviews.slice(0, expanded ? undefined : 3).map((review, index) => (
                <View key={review.reviewId} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.userInitial}>{review.username.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View>
                        <Text style={styles.reviewUser}>{review.username}</Text>
                        <Text style={styles.reviewDate}>
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.reviewRating}>
                      {renderStars(review.rating, 14)}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.message}</Text>
                </View>
              ))
            ) : (
              <View style={styles.noReviews}>
                <Ionicons name="chatbubble-outline" size={32} color="#A0AEC0" />
                <Text style={styles.noReviewsText}>No reviews yet</Text>
                <Text style={styles.noReviewsSubtext}>Be the first to share your experience!</Text>
              </View>
            )}
            
            {reviews.length > 3 && !expanded && (
              <TouchableOpacity 
                style={styles.showMoreReviews} 
                onPress={() => setExpanded(true)}
              >
                <Text style={styles.showMoreText}>
                  Show {reviews.length - 3} more reviews
                </Text>
                <Ionicons name="chevron-down" size={16} color="#377DFF" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  search: {
    flex: 1,
    fontSize: 16,
    color: '#1A202C',
  },
  clearSearch: {
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  listHeader: {
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 16,
    color: '#718096',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medicineInfo: {
    flex: 1,
    marginRight: 12,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 8,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginLeft: 6,
  },
  infoValue: {
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 20,
    marginLeft: 22,
  },
  reviewsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewsTitleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
    marginRight: 8,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addReviewText: {
    color: '#377DFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewsContent: {
    marginTop: 8,
  },
  loadingReviews: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingReviewsText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#718096',
  },
  reviewItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#377DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewUser: {
    fontWeight: '600',
    color: '#1A202C',
    fontSize: 14,
  },
  reviewDate: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    marginHorizontal: 2,
  },
  reviewText: {
    color: '#4A5568',
    fontSize: 14,
    lineHeight: 20,
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noReviewsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
    marginTop: 12,
    marginBottom: 4,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  showMoreReviews: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  showMoreText: {
    color: '#377DFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingTop: 100, // Add top padding to bring modal down
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
  modalBody: {
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 20,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A202C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'right',
    marginTop: 8,
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
  submitButton: {
    flex: 1,
    backgroundColor: '#377DFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 