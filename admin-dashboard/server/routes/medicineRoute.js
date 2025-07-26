import express from 'express';
import { 
  getAllMedicines, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine, 
  getMedicinesCount 
} from '../controllers/medicineController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Medicine CRUD routes
router.get('/', getAllMedicines);
router.get('/count', getMedicinesCount);
router.get('/:id', getMedicineById);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

export default router; 