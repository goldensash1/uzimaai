import express from 'express';
import { 
  getAllReviews, 
  getReviewById, 
  updateReviewStatus, 
  deleteReview, 
  getReviewsCount 
} from '../controllers/reviewController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Review management routes
router.get('/', getAllReviews);
router.get('/count', getReviewsCount);
router.get('/:id', getReviewById);
router.put('/:id/status', updateReviewStatus);
router.delete('/:id', deleteReview);

export default router; 