import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Log authentication state changes
  useEffect(() => {
    console.log('AuthContext: Authentication state changed:', {
      isAuthenticated,
      hasAdmin: !!admin,
      loading
    });
  }, [isAuthenticated, admin, loading]);

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    console.log('AuthContext: Checking stored auth data:', {
      hasToken: !!token,
      hasAdminData: !!adminData,
      token: token ? token.substring(0, 20) + '...' : null
    });

    if (token && adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
        setIsAuthenticated(true);
        authAPI.setAuthToken(token);
        console.log('AuthContext: Successfully restored auth state');
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    } else {
      console.log('AuthContext: No stored auth data found');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('AuthContext: Attempting login for:', username);
      const response = await authAPI.login(username, password);
      const { token, admin: adminData } = response.data;

      console.log('AuthContext: Login successful, storing data');

      // Store token and admin data
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(adminData));
      
      // Set auth token for API calls
      authAPI.setAuthToken(token);
      
      // Update state
      setAdmin(adminData);
      setIsAuthenticated(true);

      console.log('AuthContext: Login completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process...');
      // Call logout API
      await authAPI.logout();
      console.log('AuthContext: Logout API call successful');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      console.log('AuthContext: Clearing local storage and auth state...');
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      
      // Clear auth token
      authAPI.clearAuthToken();
      
      // Update state
      setAdmin(null);
      setIsAuthenticated(false);
      console.log('AuthContext: Logout completed successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedAdmin = response.data.admin;
      
      // Update stored admin data
      localStorage.setItem('adminData', JSON.stringify(updatedAdmin));
      setAdmin(updatedAdmin);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed. Please try again.'
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Password change failed. Please try again.'
      };
    }
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 