import pool from '../config/db.js';

/**
 * @desc Get all reviews
 * @route GET /api/admin/reviews
 * @access Private
 */
export const getAllReviews = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        mr.riviewId,
        mr.ReviewMessage,
        mr.rating,
        mr.reviewStatus,
        mr.reviewDate,
        mr.UserId,
        u.username
      FROM medecineReviews mr
      LEFT JOIN users u ON mr.UserId = u.userid
      ORDER BY mr.riviewId DESC
    `);

    res.json({
      success: true,
      reviews: rows
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get review by ID
 * @route GET /api/admin/reviews/:id
 * @access Private
 */
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(`
      SELECT 
        mr.riviewId,
        mr.ReviewMessage,
        mr.rating,
        mr.reviewStatus,
        mr.reviewDate,
        mr.UserId,
        u.username
      FROM medecineReviews mr
      LEFT JOIN users u ON mr.UserId = u.userid
      WHERE mr.riviewId = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      review: rows[0]
    });
  } catch (error) {
    console.error('Get review by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Update review status
 * @route PUT /api/admin/reviews/:id/status
 * @access Private
 */
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewStatus } = req.body;

    if (![0, 1].includes(reviewStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Review status must be 0 (pending) or 1 (approved)'
      });
    }

    // Check if review exists
    const [existingReview] = await pool.execute(
      'SELECT riviewId FROM medecineReviews WHERE riviewId = ?',
      [id]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update review status
    await pool.execute(
      'UPDATE medecineReviews SET reviewStatus = ? WHERE riviewId = ?',
      [reviewStatus, id]
    );

    res.json({
      success: true,
      message: 'Review status updated successfully'
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Delete review
 * @route DELETE /api/admin/reviews/:id
 * @access Private
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if review exists
    const [existingReview] = await pool.execute(
      'SELECT riviewId FROM medecineReviews WHERE riviewId = ?',
      [id]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Delete review
    await pool.execute('DELETE FROM medecineReviews WHERE riviewId = ?', [id]);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get reviews count
 * @route GET /api/admin/reviews/count
 * @access Private
 */
export const getReviewsCount = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM medecineReviews');
    
    res.json({
      success: true,
      count: rows[0].count
    });
  } catch (error) {
    console.error('Get reviews count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 