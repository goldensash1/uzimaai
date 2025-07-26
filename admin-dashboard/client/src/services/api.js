import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
  
  // Helper methods
  setAuthToken: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  clearAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Users API
export const usersAPI = {
  getUsers: (page = 1, search = '') => api.get('/users', { 
    params: { page, search } 
  }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats/overview'),
};

// Medicines API
export const medicinesAPI = {
  getMedicines: (page = 1, search = '') => {
    console.log('API call - getMedicines:', { page, search });
    console.log('API call - Authorization header:', api.defaults.headers.common['Authorization']);
    return api.get('/medicines', { 
      params: { page, search } 
    });
  },
  getMedicine: (id) => api.get(`/medicines/${id}`),
  createMedicine: (data) => api.post('/medicines', data),
  updateMedicine: (id, data) => api.put(`/medicines/${id}`, data),
  deleteMedicine: (id) => api.delete(`/medicines/${id}`),
  getMedicineStats: () => api.get('/medicines/stats/overview'),
};

// Reviews API
export const reviewsAPI = {
  getReviews: (page = 1, search = '', status = '') => api.get('/reviews', { 
    params: { page, search, status } 
  }),
  getReview: (id) => api.get(`/reviews/${id}`),
  updateReviewStatus: (id, status) => api.put(`/reviews/${id}/status`, { reviewStatus: status }),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  getReviewStats: () => api.get('/reviews/stats/overview'),
};

// Search History API
export const searchAPI = {
  getSearchHistory: (params) => api.get('/search', { params }),
  getUserSearchHistory: (userId, params) => api.get(`/search/user/${userId}`, { params }),
  getSearchStats: () => api.get('/search/stats/overview'),
  getSearchTrends: () => api.get('/search/stats/trends'),
};

// User History API
export const historyAPI = {
  getUserHistory: (params) => api.get('/history', { params }),
  getUserContext: (params) => api.get('/history/context', { params }),
  getUserHistoryById: (userId, params) => api.get(`/history/user/${userId}`, { params }),
  getHistoryStats: () => api.get('/history/stats/overview'),
  getHistoryTrends: () => api.get('/history/stats/trends'),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getSystemHealth: () => api.get('/dashboard/health'),
  getAnalytics: () => api.get('/dashboard/analytics'),
  getPerformance: () => api.get('/dashboard/performance'),
};

// Health check
export const healthAPI = {
  checkHealth: () => api.get('/health'),
};

export default api; 