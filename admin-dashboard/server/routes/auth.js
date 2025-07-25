const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Admin Login
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, password } = req.body;

    // Find admin by username or email
    const [admins] = await pool.execute(
      'SELECT * FROM admin WHERE (adminUsername = ? OR adminEmail = ?) AND adminStatus = "active"',
      [username, username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    const admin = admins[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.adminPassword);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.adminId, 
        username: admin.adminUsername,
        email: admin.adminEmail,
        status: admin.adminStatus
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { adminPassword, ...adminWithoutPassword } = admin;

    res.json({
      message: 'Login successful',
      token,
      admin: adminWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
});

// Get Admin Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [admins] = await pool.execute(
      'SELECT adminId, adminUsername, adminEmail, adminPhone, adminStatus FROM admin WHERE adminId = ?',
      [req.admin.adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({ 
        error: 'Admin not found' 
      });
    }

    res.json({
      admin: admins[0]
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching profile' 
    });
  }
});

// Update Admin Profile
router.put('/profile', authenticateToken, [
  body('adminUsername').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('adminEmail').optional().isEmail().withMessage('Invalid email format'),
  body('adminPhone').optional().isMobilePhone().withMessage('Invalid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { adminUsername, adminEmail, adminPhone } = req.body;
    const adminId = req.admin.adminId;

    // Check if username or email already exists
    if (adminUsername || adminEmail) {
      const [existing] = await pool.execute(
        'SELECT adminId FROM admin WHERE (adminUsername = ? OR adminEmail = ?) AND adminId != ?',
        [adminUsername || '', adminEmail || '', adminId]
      );

      if (existing.length > 0) {
        return res.status(400).json({ 
          error: 'Username or email already exists' 
        });
      }
    }

    // Update admin profile
    const updateFields = [];
    const updateValues = [];

    if (adminUsername) {
      updateFields.push('adminUsername = ?');
      updateValues.push(adminUsername);
    }
    if (adminEmail) {
      updateFields.push('adminEmail = ?');
      updateValues.push(adminEmail);
    }
    if (adminPhone) {
      updateFields.push('adminPhone = ?');
      updateValues.push(adminPhone);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        error: 'No fields to update' 
      });
    }

    updateValues.push(adminId);
    await pool.execute(
      `UPDATE admin SET ${updateFields.join(', ')} WHERE adminId = ?`,
      updateValues
    );

    res.json({
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      error: 'Internal server error while updating profile' 
    });
  }
});

// Change Password
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.adminId;

    // Get current password hash
    const [admins] = await pool.execute(
      'SELECT adminPassword FROM admin WHERE adminId = ?',
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({ 
        error: 'Admin not found' 
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admins[0].adminPassword);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await pool.execute(
      'UPDATE admin SET adminPassword = ? WHERE adminId = ?',
      [hashedPassword, adminId]
    );

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ 
      error: 'Internal server error while changing password' 
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logout successful'
  });
});

module.exports = router; 