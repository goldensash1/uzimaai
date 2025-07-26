import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

/**
 * @desc Admin login
 * @route POST /api/admin/login
 * @access Public
 */
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Get admin from database
    const [rows] = await pool.execute(
      'SELECT * FROM admin WHERE adminUsername = ? OR adminEmail = ?',
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const admin = rows[0];

    // Check if admin is active
    if (admin.adminStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.adminPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.adminId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { adminPassword, ...adminData } = admin;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: adminData
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get admin profile
 * @route GET /api/admin/profile
 * @access Private
 */
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const [rows] = await pool.execute(
      'SELECT adminId, adminUsername, adminEmail, adminPhone, adminStatus FROM admin WHERE adminId = ?',
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin: rows[0]
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Update admin profile
 * @route PUT /api/admin/profile
 * @access Private
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.adminId;
    const { adminUsername, adminEmail, adminPhone } = req.body;

    // Check if username or email already exists
    const [existingRows] = await pool.execute(
      'SELECT adminId FROM admin WHERE (adminUsername = ? OR adminEmail = ?) AND adminId != ?',
      [adminUsername, adminEmail, adminId]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Update admin profile
    await pool.execute(
      'UPDATE admin SET adminUsername = ?, adminEmail = ?, adminPhone = ? WHERE adminId = ?',
      [adminUsername, adminEmail, adminPhone, adminId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Change admin password
 * @route PUT /api/admin/change-password
 * @access Private
 */
export const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.admin.adminId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Get current password hash
    const [rows] = await pool.execute(
      'SELECT adminPassword FROM admin WHERE adminId = ?',
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, rows[0].adminPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.execute(
      'UPDATE admin SET adminPassword = ? WHERE adminId = ?',
      [hashedPassword, adminId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 