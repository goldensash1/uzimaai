export const API_BASE_URL = 'http://localhost/uzimaai/api/endpoints';

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
  getSearchHistory: `${API_BASE_URL}/get_search_history.php`,
}; 