import pool from '../config/db.js';

/**
 * @desc Get all search history
 * @route GET /api/admin/search-history
 * @access Private
 */
export const getAllSearchHistory = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        sh.searchId,
        sh.searchContent,
        sh.searchTime,
        sh.userid,
        u.username
      FROM searchHistory sh
      LEFT JOIN users u ON sh.userid = u.userid
      ORDER BY sh.searchId DESC
    `);

    res.json({
      success: true,
      searchHistory: rows
    });
  } catch (error) {
    console.error('Get all search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get search by ID
 * @route GET /api/admin/search-history/:id
 * @access Private
 */
export const getSearchById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(`
      SELECT 
        sh.searchId,
        sh.searchContent,
        sh.searchTime,
        sh.userid,
        u.username
      FROM searchHistory sh
      LEFT JOIN users u ON sh.userid = u.userid
      WHERE sh.searchId = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Search record not found'
      });
    }

    res.json({
      success: true,
      search: rows[0]
    });
  } catch (error) {
    console.error('Get search by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Delete search record
 * @route DELETE /api/admin/search-history/:id
 * @access Private
 */
export const deleteSearch = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if search record exists
    const [existingSearch] = await pool.execute(
      'SELECT searchId FROM searchHistory WHERE searchId = ?',
      [id]
    );

    if (existingSearch.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Search record not found'
      });
    }

    // Delete search record
    await pool.execute('DELETE FROM searchHistory WHERE searchId = ?', [id]);

    res.json({
      success: true,
      message: 'Search record deleted successfully'
    });
  } catch (error) {
    console.error('Delete search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get search history count
 * @route GET /api/admin/search-history/count
 * @access Private
 */
export const getSearchHistoryCount = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM searchHistory');
    
    res.json({
      success: true,
      count: rows[0].count
    });
  } catch (error) {
    console.error('Get search history count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 