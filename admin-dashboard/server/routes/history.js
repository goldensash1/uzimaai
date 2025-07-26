const express = require('express');
const { query, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all user history with pagination and filters
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('userId').optional().isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  query('actionType').optional().isString().withMessage('Action type must be a string'),
  query('dateFrom').optional().isISO8601().withMessage('Date from must be a valid date'),
  query('dateTo').optional().isISO8601().withMessage('Date to must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      userId = '', 
      actionType = '', 
      dateFrom = '', 
      dateTo = '' 
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (userId !== '') {
      whereClause += ' AND uh.userId = ?';
      queryParams.push(parseInt(userId));
    }

    if (actionType) {
      whereClause += ' AND uh.actionType LIKE ?';
      queryParams.push(`%${actionType}%`);
    }

    if (dateFrom) {
      whereClause += ' AND uh.actionTime >= ?';
      queryParams.push(dateFrom);
    }

    if (dateTo) {
      whereClause += ' AND uh.actionTime <= ?';
      queryParams.push(dateTo);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM userHistory uh ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get user history with user info
    const [userHistory] = await pool.execute(
      `SELECT uh.*, u.username, u.useremail 
       FROM userHistory uh 
       LEFT JOIN users u ON uh.userId = u.userid 
       ${whereClause} 
       ORDER BY uh.actionTime DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    res.json({
      userHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching user history' 
    });
  }
});

// Get user context data
router.get('/context', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('userId').optional().isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  query('dateFrom').optional().isISO8601().withMessage('Date from must be a valid date'),
  query('dateTo').optional().isISO8601().withMessage('Date to must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      userId = '', 
      dateFrom = '', 
      dateTo = '' 
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (userId !== '') {
      whereClause += ' AND uc.userId = ?';
      queryParams.push(parseInt(userId));
    }

    if (dateFrom) {
      whereClause += ' AND uc.contextTime >= ?';
      queryParams.push(dateFrom);
    }

    if (dateTo) {
      whereClause += ' AND uc.contextTime <= ?';
      queryParams.push(dateTo);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM userContext uc ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get user context with user info
    const [userContext] = await pool.execute(
      `SELECT uc.*, u.username, u.useremail 
       FROM userContext uc 
       LEFT JOIN users u ON uc.userId = u.userid 
       ${whereClause} 
       ORDER BY uc.contextTime DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    res.json({
      userContext,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user context error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching user context' 
    });
  }
});

// Get user history by user ID
router.get('/user/:userId', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Check if user exists
    const [user] = await pool.execute(
      'SELECT userid, username FROM users WHERE userid = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Get total count for this user
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM userHistory WHERE userId = ?',
      [userId]
    );
    const total = countResult[0].total;

    // Get user history for this user
    const [userHistory] = await pool.execute(
      'SELECT * FROM userHistory WHERE userId = ? ORDER BY actionTime DESC LIMIT ? OFFSET ?',
      [userId, parseInt(limit), offset]
    );

    // Get user context for this user
    const [userContext] = await pool.execute(
      'SELECT * FROM userContext WHERE userId = ? ORDER BY contextTime DESC LIMIT 10',
      [userId]
    );

    res.json({
      user: user[0],
      userHistory,
      userContext,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user history by user error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching user history' 
    });
  }
});

// Get history statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Total history entries
    const [totalHistory] = await pool.execute('SELECT COUNT(*) as total FROM userHistory');
    
    // Total context entries
    const [totalContext] = await pool.execute('SELECT COUNT(*) as total FROM userContext');
    
    // History entries today
    const [todayHistory] = await pool.execute(
      'SELECT COUNT(*) as total FROM userHistory WHERE DATE(actionTime) = CURDATE()'
    );
    
    // Context entries today
    const [todayContext] = await pool.execute(
      'SELECT COUNT(*) as total FROM userContext WHERE DATE(contextTime) = CURDATE()'
    );

    // Most common action types
    const [commonActions] = await pool.execute(
      'SELECT actionType, COUNT(*) as count FROM userHistory GROUP BY actionType ORDER BY count DESC LIMIT 10'
    );

    // Activity by hour (last 24 hours)
    const [hourlyActivity] = await pool.execute(
      `SELECT HOUR(actionTime) as hour, COUNT(*) as count 
       FROM userHistory 
       WHERE actionTime >= DATE_SUB(NOW(), INTERVAL 24 HOUR) 
       GROUP BY HOUR(actionTime) 
       ORDER BY hour`
    );

    res.json({
      totalHistory: totalHistory[0].total,
      totalContext: totalContext[0].total,
      todayHistory: todayHistory[0].total,
      todayContext: todayContext[0].total,
      commonActions,
      hourlyActivity
    });

  } catch (error) {
    console.error('History stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching history statistics' 
    });
  }
});

// Get activity trends (daily for last 30 days)
router.get('/stats/trends', authenticateToken, async (req, res) => {
  try {
    const [dailyHistory] = await pool.execute(
      `SELECT DATE(actionTime) as date, COUNT(*) as count 
       FROM userHistory 
       WHERE actionTime >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
       GROUP BY DATE(actionTime) 
       ORDER BY date`
    );

    const [dailyContext] = await pool.execute(
      `SELECT DATE(contextTime) as date, COUNT(*) as count 
       FROM userContext 
       WHERE contextTime >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
       GROUP BY DATE(contextTime) 
       ORDER BY date`
    );

    res.json({
      dailyHistory,
      dailyContext
    });

  } catch (error) {
    console.error('History trends error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching history trends' 
    });
  }
});

module.exports = router; 