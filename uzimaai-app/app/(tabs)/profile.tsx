import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput, Dimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { clearSession, getSession } from '../../utils/session';
import { useRouter } from 'expo-router';
import { apiRequest } from '../../utils/api';
import { API_ENDPOINTS } from '../../constants/api';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface User {
  userid: number;
  username: string;
  useremail: string;
  phone: string;
  emergencyphone: string;
  created_at: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit Profile Modal
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  
  // Change Password Modal
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const session = await getSession();
      if (!session?.userid) throw new Error('No user session');
      const res = await apiRequest(`${API_ENDPOINTS.profile}?userid=${session.userid}`);
      setUser(res.user);
    } catch (e: any) {
      setError(e.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => {
      await clearSession();
      router.replace('/login');
        }}
      ]
    );
  };

  const openEditModal = () => {
      setEditData({
      username: user?.username || '',
      useremail: user?.useremail || '',
      phone: user?.phone || '',
        emergencyphone: user?.emergencyphone || '',
      });
      setEditError('');
      setEditVisible(true);
  };

  const openPasswordModal = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordError('');
    setShowPassword({ current: false, new: false, confirm: false });
    setPasswordVisible(true);
  };

  const handleEditSave = async () => {
    if (!editData.username.trim() || !editData.useremail.trim()) {
      setEditError('Username and email are required');
      return;
    }

    setEditLoading(true);
    setEditError('');
    try {
      await apiRequest(API_ENDPOINTS.updateProfile, 'POST', {
        userid: user?.userid,
        username: editData.username,
        useremail: editData.useremail,
        phone: editData.phone,
        emergencyphone: editData.emergencyphone,
      });
      setEditVisible(false);
      fetchProfile();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (e: any) {
      setEditError(e.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');
    try {
      await apiRequest(API_ENDPOINTS.changePassword, 'POST', {
        userid: user?.userid,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      setPasswordVisible(false);
      Alert.alert('Success', 'Password changed successfully');
    } catch (e: any) {
      setPasswordError(e.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#377DFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#E53E3E" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user?.username}</Text>
          <Text style={styles.email}>{user?.useremail}</Text>
          <Text style={styles.memberSince}>Member since {new Date(user?.created_at || '').toLocaleDateString()}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="medical" size={24} color="#377DFF" />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Symptoms</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialIcons name="rate-review" size={24} color="#2CD283" />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="call" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Contacts</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={openEditModal}>
            <View style={styles.menuIcon}>
              <Ionicons name="person" size={20} color="#377DFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Edit Profile</Text>
              <Text style={styles.menuSubtitle}>Update your personal information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={openPasswordModal}>
            <View style={styles.menuIcon}>
              <Ionicons name="lock-closed" size={20} color="#FF9800" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Change Password</Text>
              <Text style={styles.menuSubtitle}>Update your account password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Health & Safety</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}>
            <View style={styles.menuIcon}>
              <MaterialIcons name="history" size={20} color="#2CD283" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Health History</Text>
              <Text style={styles.menuSubtitle}>View your medical records</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Privacy Settings</Text>
              <Text style={styles.menuSubtitle}>Manage your data privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications" size={20} color="#FF6B6B" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Notifications</Text>
              <Text style={styles.menuSubtitle}>Manage app notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}>
            <View style={styles.menuIcon}>
              <Ionicons name="help-circle" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Help & Support</Text>
              <Text style={styles.menuSubtitle}>Get help and contact support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#E53E3E" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
          <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
                  <TouchableOpacity onPress={() => setEditVisible(false)}>
                    <Ionicons name="close" size={24} color="#7B8CA6" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  style={styles.modalScroll}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
                      placeholder="Enter username"
              value={editData.username}
                      onChangeText={(text) => setEditData({ ...editData, username: text })}
                      returnKeyType="next"
            />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
                      placeholder="Enter email"
              value={editData.useremail}
                      onChangeText={(text) => setEditData({ ...editData, useremail: text })}
              keyboardType="email-address"
              autoCapitalize="none"
                      returnKeyType="next"
            />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
                      placeholder="Enter phone number"
              value={editData.phone}
                      onChangeText={(text) => setEditData({ ...editData, phone: text })}
              keyboardType="phone-pad"
                      returnKeyType="next"
            />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Emergency Phone</Text>
            <TextInput
              style={styles.input}
                      placeholder="Enter emergency phone"
              value={editData.emergencyphone}
                      onChangeText={(text) => setEditData({ ...editData, emergencyphone: text })}
              keyboardType="phone-pad"
                      returnKeyType="done"
                    />
                  </View>
                  
                  {editError ? <Text style={styles.errorText}>{editError}</Text> : null}
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setEditVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleEditSave} disabled={editLoading}>
                    {editLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
              </TouchableOpacity>
            </View>
          </View>
            </KeyboardAvoidingView>
        </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={passwordVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Change Password</Text>
                  <TouchableOpacity onPress={() => setPasswordVisible(false)}>
                    <Ionicons name="close" size={24} color="#7B8CA6" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  style={styles.modalScroll}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                        secureTextEntry={!showPassword.current}
                        returnKeyType="next"
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      >
                        <Ionicons 
                          name={showPassword.current ? "eye-off" : "eye"} 
                          size={20} 
                          color="#A0AEC0" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                        secureTextEntry={!showPassword.new}
                        returnKeyType="next"
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      >
                        <Ionicons 
                          name={showPassword.new ? "eye-off" : "eye"} 
                          size={20} 
                          color="#A0AEC0" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                        secureTextEntry={!showPassword.confirm}
                        returnKeyType="done"
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      >
                        <Ionicons 
                          name={showPassword.confirm ? "eye-off" : "eye"} 
                          size={20} 
                          color="#A0AEC0" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setPasswordVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handlePasswordChange} disabled={passwordLoading}>
                    {passwordLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Change Password</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    paddingBottom: 120,
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#377DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FED7D7',
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  logoutText: {
    color: '#E53E3E',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
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
    color: '#1A202C',
  },
  modalScroll: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A202C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1A202C',
  },
  eyeButton: {
    padding: 16,
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
  saveButton: {
    flex: 1,
    backgroundColor: '#377DFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 