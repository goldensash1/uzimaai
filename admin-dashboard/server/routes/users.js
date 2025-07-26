const express = require('express');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all users with pagination and search
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (search) {
      whereClause += ' AND (username LIKE ? OR useremail LIKE ? OR phone LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND userstatus = ?';
      queryParams.push(status);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get users with pagination (simplified query)
    const [users] = await pool.execute(
      `SELECT userid, username, useremail, phone, emergencyphone, userstatus
       FROM users ${whereClause} 
       ORDER BY userid DESC`,
      queryParams
    );

    // Get additional stats for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const [searchCount] = await pool.execute(
        'SELECT COUNT(*) as count FROM searchHistory WHERE userid = ?',
        [user.userid]
      );
      const [historyCount] = await pool.execute(
        'SELECT COUNT(*) as count FROM userHistory WHERE userId = ?',
        [user.userid]
      );
      
      return {
        ...user,
        searchCount: searchCount[0].count,
        historyCount: historyCount[0].count
      };
    }));

    res.json({
      users: usersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching users' 
    });
  }
});

// Get single user by ID
router.get('/:id', authenticateToken, [
  query('id').isInt({ min: 1 }).withMessage('User ID must be a positive integer')
], async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      `SELECT u.*, 
       (SELECT COUNT(*) FROM searchHistory WHERE userid = u.userid) as searchCount,
       (SELECT COUNT(*) FROM userHistory WHERE userId = u.userid) as historyCount,
       (SELECT COUNT(*) FROM medecineReviews WHERE UserId = u.userid) as reviewCount
       FROM users u WHERE u.userid = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Get user's search history
    const [searchHistory] = await pool.execute(
      'SELECT * FROM searchHistory WHERE userid = ? ORDER BY searchTime DESC LIMIT 10',
      [id]
    );

    // Get user's recent activity
    const [userHistory] = await pool.execute(
      'SELECT * FROM userHistory WHERE userId = ? ORDER BY actionTime DESC LIMIT 10',
      [id]
    );

    res.json({
      user: users[0],
      searchHistory,
      userHistory
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching user' 
    });
  }
});

// Create new user
router.post('/', authenticateToken, [
  body('username').notEmpty().withMessage('Username is required'),
  body('useremail').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('userpassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('emergencyphone').optional().isMobilePhone().withMessage('Invalid emergency phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, useremail, phone, userpassword, emergencyphone } = req.body;

    // Check if user already exists
    const [existing] = await pool.execute(
      'SELECT userid FROM users WHERE useremail = ? OR phone = ?',
      [useremail, phone]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        error: 'User with this email or phone already exists' 
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(userpassword, 12);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (username, useremail, phone, emergencyphone, userpassword, userstatus) VALUES (?, ?, ?, ?, ?, "active")',
      [username, useremail, phone, emergencyphone || null, hashedPassword]
    );

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      error: 'Internal server error while creating user' 
    });
  }
});

// Update user
router.put('/:id', authenticateToken, [
  body('username').optional().isLength({ min: 2 }).withMessage('Username must be at least 2 characters'),
  body('useremail').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('emergencyphone').optional().isMobilePhone().withMessage('Invalid emergency phone number'),
  body('userstatus').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { username, useremail, phone, emergencyphone, userstatus } = req.body;

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT userid FROM users WHERE userid = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Check if email or phone already exists for other users
    if (useremail || phone) {
      const [duplicate] = await pool.execute(
        'SELECT userid FROM users WHERE (useremail = ? OR phone = ?) AND userid != ?',
        [useremail || '', phone || '', id]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({ 
          error: 'Email or phone already exists for another user' 
        });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    if (useremail) {
      updateFields.push('useremail = ?');
      updateValues.push(useremail);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (emergencyphone !== undefined) {
      updateFields.push('emergencyphone = ?');
      updateValues.push(emergencyphone);
    }
    if (userstatus) {
      updateFields.push('userstatus = ?');
      updateValues.push(userstatus);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        error: 'No fields to update' 
      });
    }

    updateValues.push(id);
    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE userid = ?`,
      updateValues
    );

    res.json({
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      error: 'Internal server error while updating user' 
    });
  }
});

// Delete user (soft delete by setting status to inactive)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT userid FROM users WHERE userid = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Soft delete by setting status to inactive
    await pool.execute(
      'UPDATE users SET userstatus = "inactive" WHERE userid = ?',
      [id]
    );

    res.json({
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      error: 'Internal server error while deleting user' 
    });
  }
});

// Get user statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Total users
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as total FROM users');
    
    // Active users
    const [activeUsers] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE userstatus = "active"');
    
    // Users with emergency contacts
    const [usersWithEmergency] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE emergencyphone IS NOT NULL');
    
    // Recent registrations (last 30 days)
    const [recentUsers] = await pool.execute(
      'SELECT COUNT(*) as total FROM users WHERE userid > (SELECT MAX(userid) - 30 FROM users)'
    );

    res.json({
      totalUsers: totalUsers[0].total,
      activeUsers: activeUsers[0].total,
      inactiveUsers: totalUsers[0].total - activeUsers[0].total,
      usersWithEmergency: usersWithEmergency[0].total,
      recentUsers: recentUsers[0].total
    });

  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching user statistics' 
    });
  }
});

module.exports = router; 