// IMPORTANT: Replace 'YOUR_LOCAL_IP' with your computer's local network IP address (e.g., 192.168.1.10)
// Current IP: localhost (updated on 2025-07-30)
export const API_BASE_URL = 'http://localhost/uzimaai/api/endpoints';

// Fallback URLs in case the primary IP doesn't work
export const FALLBACK_URLS = [
  'http://localhost/uzimaai/api/endpoints',     // Localhost (working)
  'http://172.17.224.138/uzimaai/api/endpoints', // Previous IP
  'http://192.168.8.108/uzimaai/api/endpoints', // Previous IP
];

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/register.php`,
  login: `${API_BASE_URL}/login.php`,
  profile: `${API_BASE_URL}/profile.php`,
  updateProfile: `${API_BASE_URL}/update_profile.php`,
  changePassword: `${API_BASE_URL}/change_password.php`,
  medicines: `${API_BASE_URL}/medicines.php`,
  addMedicineReview: `${API_BASE_URL}/add_medicine_review.php`,
  getMedicineReviews: `${API_BASE_URL}/get_medicine_reviews.php`,
  sendMessage: `${API_BASE_URL}/send_message.php`,
  getChatHistory: `${API_BASE_URL}/get_chat_history.php`,
  aiChat: `${API_BASE_URL}/ai_chat_enhanced.php`, // Enhanced AI with medicine recommendations
  aiStatus: `${API_BASE_URL}/ai_status.php`,
  getSearchHistory: `${API_BASE_URL}/get_search_history.php`,
  emergencyContacts: `${API_BASE_URL}/emergency_contacts.php`,
  addEmergencyContact: `${API_BASE_URL}/add_emergency_contact.php`,
  updateEmergencyContact: `${API_BASE_URL}/update_emergency_contact.php`,
  deleteEmergencyContact: `${API_BASE_URL}/delete_emergency_contact.php`,
  setPrimaryEmergencyContact: `${API_BASE_URL}/set_primary_emergency_contact.php`,
  firstAidPractices: `${API_BASE_URL}/first_aid_practices.php`,
}; 