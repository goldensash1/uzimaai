import express from 'express';
import { 
  getAllSearchHistory, 
  getSearchById, 
  deleteSearch, 
  getSearchHistoryCount 
} from '../controllers/searchController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Search history routes
router.get('/', getAllSearchHistory);
router.get('/count', getSearchHistoryCount);
router.get('/:id', getSearchById);
router.delete('/:id', deleteSearch);

export default router; 