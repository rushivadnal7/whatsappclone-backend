import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  getUsers
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/logout', auth, logout);
router.get('/users', auth, getUsers);

export default router;
