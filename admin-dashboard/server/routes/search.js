const express = require('express');
const { query, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all search history with pagination and filters
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
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
      search = '', 
      userId = '', 
      dateFrom = '', 
      dateTo = '' 
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (search) {
      whereClause += ' AND sh.searchContent LIKE ?';
      queryParams.push(`%${search}%`);
    }

    if (userId !== '') {
      whereClause += ' AND sh.userid = ?';
      queryParams.push(parseInt(userId));
    }

    if (dateFrom) {
      whereClause += ' AND sh.searchTime >= ?';
      queryParams.push(dateFrom);
    }

    if (dateTo) {
      whereClause += ' AND sh.searchTime <= ?';
      queryParams.push(dateTo);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM searchHistory sh ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get search history with user info
    const [searchHistory] = await pool.execute(
      `SELECT sh.*, u.username, u.useremail 
       FROM searchHistory sh 
       LEFT JOIN users u ON sh.userid = u.userid 
       ${whereClause} 
       ORDER BY sh.searchTime DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    res.json({
      searchHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching search history' 
    });
  }
});

// Get search history by user ID
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
      'SELECT COUNT(*) as total FROM searchHistory WHERE userid = ?',
      [userId]
    );
    const total = countResult[0].total;

    // Get search history for this user
    const [searchHistory] = await pool.execute(
      'SELECT * FROM searchHistory WHERE userid = ? ORDER BY searchTime DESC LIMIT ? OFFSET ?',
      [userId, parseInt(limit), offset]
    );

    res.json({
      user: user[0],
      searchHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user search history error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching user search history' 
    });
  }
});

// Get search statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Total searches
    const [totalSearches] = await pool.execute('SELECT COUNT(*) as total FROM searchHistory');
    
    // Searches today
    const [todaySearches] = await pool.execute(
      'SELECT COUNT(*) as total FROM searchHistory WHERE DATE(searchTime) = CURDATE()'
    );
    
    // Searches this week
    const [weekSearches] = await pool.execute(
      'SELECT COUNT(*) as total FROM searchHistory WHERE searchTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    
    // Searches this month
    const [monthSearches] = await pool.execute(
      'SELECT COUNT(*) as total FROM searchHistory WHERE searchTime >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    // Most common search terms
    const [commonSearches] = await pool.execute(
      'SELECT searchContent, COUNT(*) as count FROM searchHistory GROUP BY searchContent ORDER BY count DESC LIMIT 10'
    );

    // Searches by hour (last 24 hours)
    const [hourlySearches] = await pool.execute(
      `SELECT HOUR(searchTime) as hour, COUNT(*) as count 
       FROM searchHistory 
       WHERE searchTime >= DATE_SUB(NOW(), INTERVAL 24 HOUR) 
       GROUP BY HOUR(searchTime) 
       ORDER BY hour`
    );

    res.json({
      totalSearches: totalSearches[0].total,
      todaySearches: todaySearches[0].total,
      weekSearches: weekSearches[0].total,
      monthSearches: monthSearches[0].total,
      commonSearches,
      hourlySearches
    });

  } catch (error) {
    console.error('Search stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching search statistics' 
    });
  }
});

// Get search trends (daily for last 30 days)
router.get('/stats/trends', authenticateToken, async (req, res) => {
  try {
    const [dailySearches] = await pool.execute(
      `SELECT DATE(searchTime) as date, COUNT(*) as count 
       FROM searchHistory 
       WHERE searchTime >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
       GROUP BY DATE(searchTime) 
       ORDER BY date`
    );

    res.json({
      dailySearches
    });

  } catch (error) {
    console.error('Search trends error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching search trends' 
    });
  }
});

module.exports = router; 