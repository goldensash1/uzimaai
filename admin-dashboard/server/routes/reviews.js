const express = require('express');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all reviews with pagination and filters
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().custom((value) => {
    if (value === '' || value === undefined) return true;
    return [0, 1].includes(parseInt(value));
  }).withMessage('Status must be 0 or 1'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('medicineId').optional().isInt({ min: 1 }).withMessage('Medicine ID must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { page = 1, limit = 10, status = '', rating = '', medicineId = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (status !== '') {
      whereClause += ' AND mr.reviewStatus = ?';
      queryParams.push(parseInt(status));
    }

    if (rating !== '') {
      whereClause += ' AND mr.rating = ?';
      queryParams.push(parseInt(rating));
    }

    if (medicineId !== '') {
      whereClause += ' AND mr.medicineId = ?';
      queryParams.push(parseInt(medicineId));
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM medecineReviews mr ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get reviews with user and medicine info
    const [reviews] = await pool.execute(
      `SELECT mr.*, u.username, u.useremail, m.medicineName 
       FROM medecineReviews mr 
       LEFT JOIN users u ON mr.UserId = u.userid 
       LEFT JOIN medecines m ON mr.medicineId = m.medicineId 
       ${whereClause} 
       ORDER BY mr.reviewDate DESC`,
      queryParams
    );

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching reviews' 
    });
  }
});

// Get single review by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [reviews] = await pool.execute(
      `SELECT mr.*, u.username, u.useremail, m.medicineName 
       FROM medecineReviews mr 
       LEFT JOIN users u ON mr.UserId = u.userid 
       LEFT JOIN medecines m ON mr.medicineId = m.medicineId 
       WHERE mr.riviewId = ?`,
      [id]
    );

    if (reviews.length === 0) {
      return res.status(404).json({ 
        error: 'Review not found' 
      });
    }

    res.json({
      review: reviews[0]
    });

  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching review' 
    });
  }
});

// Update review status (moderation)
router.put('/:id/status', authenticateToken, [
  body('reviewStatus').isInt({ min: 0, max: 1 }).withMessage('Status must be 0 or 1')
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
    const { reviewStatus } = req.body;

    // Check if review exists
    const [existing] = await pool.execute(
      'SELECT riviewId FROM medecineReviews WHERE riviewId = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        error: 'Review not found' 
      });
    }

    // Update review status
    await pool.execute(
      'UPDATE medecineReviews SET reviewStatus = ? WHERE riviewId = ?',
      [reviewStatus, id]
    );

    res.json({
      message: 'Review status updated successfully'
    });

  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ 
      error: 'Internal server error while updating review status' 
    });
  }
});

// Delete review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if review exists
    const [existing] = await pool.execute(
      'SELECT riviewId FROM medecineReviews WHERE riviewId = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        error: 'Review not found' 
      });
    }

    // Delete review
    await pool.execute(
      'DELETE FROM medecineReviews WHERE riviewId = ?',
      [id]
    );

    res.json({
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ 
      error: 'Internal server error while deleting review' 
    });
  }
});

// Get review statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Total reviews
    const [totalReviews] = await pool.execute('SELECT COUNT(*) as total FROM medecineReviews');
    
    // Approved reviews
    const [approvedReviews] = await pool.execute('SELECT COUNT(*) as total FROM medecineReviews WHERE reviewStatus = 1');
    
    // Pending reviews
    const [pendingReviews] = await pool.execute('SELECT COUNT(*) as total FROM medecineReviews WHERE reviewStatus = 0');
    
    // Average rating
    const [avgRating] = await pool.execute('SELECT AVG(rating) as average FROM medecineReviews');
    
    // Rating distribution
    const [ratingDistribution] = await pool.execute(
      'SELECT rating, COUNT(*) as count FROM medecineReviews GROUP BY rating ORDER BY rating'
    );

    res.json({
      totalReviews: totalReviews[0].total,
      approvedReviews: approvedReviews[0].total,
      pendingReviews: pendingReviews[0].total,
      averageRating: avgRating[0].average || 0,
      ratingDistribution
    });

  } catch (error) {
    console.error('Review stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching review statistics' 
    });
  }
});

module.exports = router; 