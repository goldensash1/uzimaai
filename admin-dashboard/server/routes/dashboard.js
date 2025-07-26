const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard overview statistics
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    // User statistics
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const [activeUsers] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE userstatus = "active"');
    const [newUsersToday] = await pool.execute(
      'SELECT COUNT(*) as total FROM users WHERE DATE(userid) = CURDATE()'
    );

    // Medicine statistics
    const [totalMedicines] = await pool.execute('SELECT COUNT(*) as total FROM medecines');
    const [activeMedicines] = await pool.execute('SELECT COUNT(*) as total FROM medecines WHERE medicineStatus = 1');

    // Review statistics
    const [totalReviews] = await pool.execute('SELECT COUNT(*) as total FROM medecineReviews');
    const [pendingReviews] = await pool.execute('SELECT COUNT(*) as total FROM medecineReviews WHERE reviewStatus = 0');
    const [avgRating] = await pool.execute('SELECT AVG(rating) as average FROM medecineReviews');

    // Search statistics
    const [totalSearches] = await pool.execute('SELECT COUNT(*) as total FROM searchHistory');
    const [todaySearches] = await pool.execute(
      'SELECT COUNT(*) as total FROM searchHistory WHERE DATE(searchTime) = CURDATE()'
    );

    // Activity statistics
    const [totalHistory] = await pool.execute('SELECT COUNT(*) as total FROM userHistory');
    const [todayHistory] = await pool.execute(
      'SELECT COUNT(*) as total FROM userHistory WHERE DATE(actionTime) = CURDATE()'
    );

    res.json({
      users: {
        total: totalUsers[0].total,
        active: activeUsers[0].total,
        newToday: newUsersToday[0].total,
        inactive: totalUsers[0].total - activeUsers[0].total
      },
      medicines: {
        total: totalMedicines[0].total,
        active: activeMedicines[0].total,
        inactive: totalMedicines[0].total - activeMedicines[0].total
      },
      reviews: {
        total: totalReviews[0].total,
        pending: pendingReviews[0].total,
        approved: totalReviews[0].total - pendingReviews[0].total,
        averageRating: avgRating[0].average || 0
      },
      searches: {
        total: totalSearches[0].total,
        today: todaySearches[0].total
      },
      activity: {
        total: totalHistory[0].total,
        today: todayHistory[0].total
      }
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching dashboard overview' 
    });
  }
});

// Get recent activity
router.get('/recent-activity', authenticateToken, async (req, res) => {
  try {
    // Recent user registrations
    const [recentUsers] = await pool.execute(
      'SELECT userid, username, useremail, userstatus FROM users ORDER BY userid DESC LIMIT 5'
    );

    // Recent medicine additions
    const [recentMedicines] = await pool.execute(
      'SELECT medicineId, medicineName, medicineStatus, updatedDate FROM medecines ORDER BY medicineId DESC LIMIT 5'
    );

    // Recent reviews
    const [recentReviews] = await pool.execute(
      `SELECT mr.riviewId, mr.rating, mr.reviewDate, mr.reviewStatus, 
              u.username, m.medicineName 
       FROM medecineReviews mr 
       LEFT JOIN users u ON mr.UserId = u.userid 
       LEFT JOIN medecines m ON mr.medicineId = m.medicineId 
       ORDER BY mr.reviewDate DESC LIMIT 5`
    );

    // Recent searches
    const [recentSearches] = await pool.execute(
      `SELECT sh.searchId, sh.searchContent, sh.searchTime, u.username 
       FROM searchHistory sh 
       LEFT JOIN users u ON sh.userid = u.userid 
       ORDER BY sh.searchTime DESC LIMIT 5`
    );

    res.json({
      recentUsers,
      recentMedicines,
      recentReviews,
      recentSearches
    });

  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching recent activity' 
    });
  }
});

// Get system health
router.get('/health', authenticateToken, async (req, res) => {
  try {
    // Database connection test
    let dbStatus = 'healthy';
    try {
      await pool.execute('SELECT 1');
    } catch (error) {
      dbStatus = 'unhealthy';
    }

    // Table row counts
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [medicineCount] = await pool.execute('SELECT COUNT(*) as count FROM medecines');
    const [reviewCount] = await pool.execute('SELECT COUNT(*) as count FROM medecineReviews');
    const [searchCount] = await pool.execute('SELECT COUNT(*) as count FROM searchHistory');

    // System uptime (simplified)
    const uptime = process.uptime();

    res.json({
      status: 'healthy',
      database: dbStatus,
      uptime: Math.floor(uptime),
      tables: {
        users: userCount[0].count,
        medicines: medicineCount[0].count,
        reviews: reviewCount[0].count,
        searches: searchCount[0].count
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ 
      error: 'Internal server error while checking system health' 
    });
  }
});

// Get analytics data
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    // User growth (last 30 days)
    const [userGrowth] = await pool.execute(
      `SELECT DATE(FROM_UNIXTIME(userid)) as date, COUNT(*) as count 
       FROM users 
       WHERE userid >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 30 DAY)) 
       GROUP BY DATE(FROM_UNIXTIME(userid)) 
       ORDER BY date`
    );

    // Search trends (last 7 days)
    const [searchTrends] = await pool.execute(
      `SELECT DATE(searchTime) as date, COUNT(*) as count 
       FROM searchHistory 
       WHERE searchTime >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
       GROUP BY DATE(searchTime) 
       ORDER BY date`
    );

    // Review trends (last 7 days)
    const [reviewTrends] = await pool.execute(
      `SELECT DATE(reviewDate) as date, COUNT(*) as count 
       FROM medecineReviews 
       WHERE reviewDate >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
       GROUP BY DATE(reviewDate) 
       ORDER BY date`
    );

    // Top searched terms
    const [topSearches] = await pool.execute(
      'SELECT searchContent, COUNT(*) as count FROM searchHistory GROUP BY searchContent ORDER BY count DESC LIMIT 10'
    );

    // Top rated medicines
    const [topMedicines] = await pool.execute(
      `SELECT m.medicineName, AVG(mr.rating) as avgRating, COUNT(mr.riviewId) as reviewCount 
       FROM medecines m 
       LEFT JOIN medecineReviews mr ON m.medicineId = mr.medicineId 
       WHERE m.medicineStatus = 1 
       GROUP BY m.medicineId 
       HAVING avgRating IS NOT NULL 
       ORDER BY avgRating DESC, reviewCount DESC 
       LIMIT 10`
    );

    res.json({
      userGrowth,
      searchTrends,
      reviewTrends,
      topSearches,
      topMedicines
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching analytics' 
    });
  }
});

// Get performance metrics
router.get('/performance', authenticateToken, async (req, res) => {
  try {
    // Average response time (simplified)
    const responseTime = Math.random() * 100 + 50; // Mock data

    // Error rate (simplified)
    const errorRate = Math.random() * 5; // Mock data

    // Database performance
    const startTime = Date.now();
    await pool.execute('SELECT COUNT(*) FROM users');
    const dbResponseTime = Date.now() - startTime;

    // Memory usage (simplified)
    const memoryUsage = process.memoryUsage();

    res.json({
      responseTime: Math.round(responseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      databaseResponseTime: dbResponseTime,
      memoryUsage: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) // MB
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching performance metrics' 
    });
  }
});

module.exports = router; 