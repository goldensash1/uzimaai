import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUsersCount 
} from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// User CRUD routes
router.get('/', getAllUsers);
router.get('/count', getUsersCount);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router; 