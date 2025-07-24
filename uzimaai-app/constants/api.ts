// IMPORTANT: Replace 'YOUR_LOCAL_IP' with your computer's local network IP address (e.g., 192.168.1.10)
export const API_BASE_URL = 'http://192.168.8.144/uzimaai/api/endpoints';

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/register.php`,
  login: `${API_BASE_URL}/login.php`,
  profile: `${API_BASE_URL}/profile.php`,
  updateProfile: `${API_BASE_URL}/update_profile.php`,
  medicines: `${API_BASE_URL}/medicines.php`,
  addMedicineReview: `${API_BASE_URL}/add_medicine_review.php`,
  getMedicineReviews: `${API_BASE_URL}/get_medicine_reviews.php`,
  sendMessage: `${API_BASE_URL}/send_message.php`,
  getChatHistory: `${API_BASE_URL}/get_chat_history.php`,
  aiChat: `${API_BASE_URL}/ai_chat.php`,
  getSearchHistory: `${API_BASE_URL}/get_search_history.php`,
  emergencyContacts: `${API_BASE_URL}/emergency_contacts.php`,
  addEmergencyContact: `${API_BASE_URL}/add_emergency_contact.php`,
  updateEmergencyContact: `${API_BASE_URL}/update_emergency_contact.php`,
  deleteEmergencyContact: `${API_BASE_URL}/delete_emergency_contact.php`,
  setPrimaryEmergencyContact: `${API_BASE_URL}/set_primary_emergency_contact.php`,
}; 