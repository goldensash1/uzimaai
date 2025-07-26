import pool from '../config/db.js';

/**
 * @desc Get all medicines
 * @route GET /api/admin/medicines
 * @access Private
 */
export const getAllMedicines = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT medicineId, medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate FROM medecines ORDER BY medicineId DESC'
    );

    res.json({
      success: true,
      medicines: rows
    });
  } catch (error) {
    console.error('Get all medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get medicine by ID
 * @route GET /api/admin/medicines/:id
 * @access Private
 */
export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT medicineId, medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate FROM medecines WHERE medicineId = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.json({
      success: true,
      medicine: rows[0]
    });
  } catch (error) {
    console.error('Get medicine by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Create new medicine
 * @route POST /api/admin/medicines
 * @access Private
 */
export const createMedicine = async (req, res) => {
  try {
    const { 
      medicineName, 
      medicineUses, 
      medicineSideEffects, 
      medicineAlternatives, 
      medicineStatus = 1 
    } = req.body;

    // Validate required fields
    if (!medicineName || !medicineUses || !medicineSideEffects) {
      return res.status(400).json({
        success: false,
        message: 'Medicine name, uses, and side effects are required'
      });
    }

    // Check if medicine already exists
    const [existingRows] = await pool.execute(
      'SELECT medicineId FROM medecines WHERE medicineName = ?',
      [medicineName]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Medicine with this name already exists'
      });
    }

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert new medicine
    const [result] = await pool.execute(
      'INSERT INTO medecines (medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate) VALUES (?, ?, ?, ?, ?, ?)',
      [medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, currentDate]
    );

    res.status(201).json({
      success: true,
      message: 'Medicine created successfully',
      medicine: {
        medicineId: result.insertId,
        medicineName,
        medicineUses,
        medicineSideEffects,
        medicineAlternatives,
        medicineStatus,
        updatedDate: currentDate
      }
    });
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Update medicine
 * @route PUT /api/admin/medicines/:id
 * @access Private
 */
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      medicineName, 
      medicineUses, 
      medicineSideEffects, 
      medicineAlternatives, 
      medicineStatus 
    } = req.body;

    // Check if medicine exists
    const [existingMedicine] = await pool.execute(
      'SELECT medicineId FROM medecines WHERE medicineId = ?',
      [id]
    );

    if (existingMedicine.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Check if medicine name already exists for other medicines
    const [duplicateRows] = await pool.execute(
      'SELECT medicineId FROM medecines WHERE medicineName = ? AND medicineId != ?',
      [medicineName, id]
    );

    if (duplicateRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Medicine with this name already exists'
      });
    }

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Update medicine
    await pool.execute(
      'UPDATE medecines SET medicineName = ?, medicineUses = ?, medicineSideEffects = ?, medicineAlternatives = ?, medicineStatus = ?, updatedDate = ? WHERE medicineId = ?',
      [medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, currentDate, id]
    );

    res.json({
      success: true,
      message: 'Medicine updated successfully'
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Delete medicine
 * @route DELETE /api/admin/medicines/:id
 * @access Private
 */
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if medicine exists
    const [existingMedicine] = await pool.execute(
      'SELECT medicineId FROM medecines WHERE medicineId = ?',
      [id]
    );

    if (existingMedicine.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Delete medicine
    await pool.execute('DELETE FROM medecines WHERE medicineId = ?', [id]);

    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get medicines count
 * @route GET /api/admin/medicines/count
 * @access Private
 */
export const getMedicinesCount = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM medecines');
    
    res.json({
      success: true,
      count: rows[0].count
    });
  } catch (error) {
    console.error('Get medicines count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 