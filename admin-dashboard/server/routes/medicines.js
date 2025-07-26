const express = require('express');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all medicines with pagination and search
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('status').optional().isInt({ min: 0, max: 1 }).withMessage('Status must be 0 or 1')
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
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (search) {
      whereClause += ' AND medicineName LIKE ?';
      queryParams.push(`%${search}%`);
    }

    if (status !== '') {
      whereClause += ' AND medicineStatus = ?';
      queryParams.push(parseInt(status));
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM medecines ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get medicines with pagination
    const [medicines] = await pool.execute(
      `SELECT m.*, 
       (SELECT COUNT(*) FROM medecineReviews WHERE medicineId = m.medicineId) as reviewCount,
       (SELECT AVG(rating) FROM medecineReviews WHERE medicineId = m.medicineId) as avgRating
       FROM medecines m ${whereClause} 
       ORDER BY m.medicineId DESC`,
      queryParams
    );

    res.json({
      medicines,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching medicines' 
    });
  }
});

// Get single medicine by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [medicines] = await pool.execute(
      `SELECT m.*, 
       (SELECT COUNT(*) FROM medecineReviews WHERE medicineId = m.medicineId) as reviewCount,
       (SELECT AVG(rating) FROM medecineReviews WHERE medicineId = m.medicineId) as avgRating
       FROM medecines m WHERE m.medicineId = ?`,
      [id]
    );

    if (medicines.length === 0) {
      return res.status(404).json({ 
        error: 'Medicine not found' 
      });
    }

    // Get medicine reviews
    const [reviews] = await pool.execute(
      `SELECT mr.*, u.username 
       FROM medecineReviews mr 
       LEFT JOIN users u ON mr.UserId = u.userid 
       WHERE mr.medicineId = ? 
       ORDER BY mr.reviewDate DESC`,
      [id]
    );

    res.json({
      medicine: medicines[0],
      reviews
    });

  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching medicine' 
    });
  }
});

// Create new medicine
router.post('/', authenticateToken, [
  body('medicineName').notEmpty().withMessage('Medicine name is required'),
  body('medicineUses').notEmpty().withMessage('Medicine uses are required'),
  body('medicineSideEffects').notEmpty().withMessage('Medicine side effects are required'),
  body('medicineAlternatives').optional().isString().withMessage('Medicine alternatives must be a string'),
  body('medicineStatus').optional().isInt({ min: 0, max: 1 }).withMessage('Status must be 0 or 1')
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
      medicineName, 
      medicineUses, 
      medicineSideEffects, 
      medicineAlternatives,
      medicineStatus = 1 
    } = req.body;

    // Check if medicine already exists
    const [existing] = await pool.execute(
      'SELECT medicineId FROM medecines WHERE medicineName = ?',
      [medicineName]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        error: 'Medicine with this name already exists' 
      });
    }

    // Create medicine
    const [result] = await pool.execute(
      'INSERT INTO medecines (medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate) VALUES (?, ?, ?, ?, ?, NOW())',
      [medicineName, medicineUses, medicineSideEffects, medicineAlternatives || '', medicineStatus]
    );

    res.status(201).json({
      message: 'Medicine created successfully',
      medicineId: result.insertId
    });

  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({ 
      error: 'Internal server error while creating medicine' 
    });
  }
});

// Update medicine
router.put('/:id', authenticateToken, [
  body('medicineName').optional().notEmpty().withMessage('Medicine name cannot be empty'),
  body('medicineUses').optional().notEmpty().withMessage('Medicine uses cannot be empty'),
  body('medicineSideEffects').optional().notEmpty().withMessage('Medicine side effects cannot be empty'),
  body('medicineAlternatives').optional().isString().withMessage('Medicine alternatives must be a string'),
  body('medicineStatus').optional().isInt({ min: 0, max: 1 }).withMessage('Status must be 0 or 1')
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
    const { 
      medicineName, 
      medicineUses, 
      medicineSideEffects, 
      medicineAlternatives,
      medicineStatus 
    } = req.body;

    // Check if medicine exists
    const [existing] = await pool.execute(
      'SELECT medicineId FROM medecines WHERE medicineId = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        error: 'Medicine not found' 
      });
    }

    // Check if medicine name already exists for other medicines
    if (medicineName) {
      const [duplicate] = await pool.execute(
        'SELECT medicineId FROM medecines WHERE medicineName = ? AND medicineId != ?',
        [medicineName, id]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({ 
          error: 'Medicine name already exists for another medicine' 
        });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (medicineName) {
      updateFields.push('medicineName = ?');
      updateValues.push(medicineName);
    }
    if (medicineUses) {
      updateFields.push('medicineUses = ?');
      updateValues.push(medicineUses);
    }
    if (medicineSideEffects) {
      updateFields.push('medicineSideEffects = ?');
      updateValues.push(medicineSideEffects);
    }
    if (medicineAlternatives !== undefined) {
      updateFields.push('medicineAlternatives = ?');
      updateValues.push(medicineAlternatives);
    }
    if (medicineStatus !== undefined) {
      updateFields.push('medicineStatus = ?');
      updateValues.push(medicineStatus);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        error: 'No fields to update' 
      });
    }

    // Add updatedDate and medicineId
    updateFields.push('updatedDate = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE medecines SET ${updateFields.join(', ')} WHERE medicineId = ?`,
      updateValues
    );

    res.json({
      message: 'Medicine updated successfully'
    });

  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({ 
      error: 'Internal server error while updating medicine' 
    });
  }
});

// Delete medicine (soft delete by setting status to 0)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if medicine exists
    const [existing] = await pool.execute(
      'SELECT medicineId FROM medecines WHERE medicineId = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        error: 'Medicine not found' 
      });
    }

    // Soft delete by setting status to 0
    await pool.execute(
      'UPDATE medecines SET medicineStatus = 0, updatedDate = NOW() WHERE medicineId = ?',
      [id]
    );

    res.json({
      message: 'Medicine deactivated successfully'
    });

  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({ 
      error: 'Internal server error while deleting medicine' 
    });
  }
});

// Get medicine statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Total medicines
    const [totalMedicines] = await pool.execute('SELECT COUNT(*) as total FROM medecines');
    
    // Active medicines
    const [activeMedicines] = await pool.execute('SELECT COUNT(*) as total FROM medecines WHERE medicineStatus = 1');
    
    // Inactive medicines
    const [inactiveMedicines] = await pool.execute('SELECT COUNT(*) as total FROM medecines WHERE medicineStatus = 0');
    
    // Total reviews
    const [totalReviews] = await pool.execute('SELECT COUNT(*) as total FROM medecineReviews');
    
    // Average rating
    const [avgRating] = await pool.execute('SELECT AVG(rating) as average FROM medecineReviews');

    res.json({
      totalMedicines: totalMedicines[0].total,
      activeMedicines: activeMedicines[0].total,
      inactiveMedicines: inactiveMedicines[0].total,
      totalReviews: totalReviews[0].total,
      averageRating: avgRating[0].average || 0
    });

  } catch (error) {
    console.error('Medicine stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching medicine statistics' 
    });
  }
});

module.exports = router; 