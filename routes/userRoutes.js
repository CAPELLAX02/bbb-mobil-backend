import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyEmail,
  sendForgotPasswordEmail,
  resetPassword,
  updateUserPushToken,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser); // public

router.post('/auth', authUser); // public

router.post('/logout', logoutUser); // public

router
  .route('/profile')
  .get(protect, getUserProfile) // private (protected)
  .put(protect, updateUserProfile); // private (protected)

router.post('/verify-email', verifyEmail); // public

router.post('/forgot-password', sendForgotPasswordEmail); // public

router.post('/reset-password', resetPassword); // public

// router.put('/:id/push-token', protect, updateUserPushToken);
router.put('/push-token', protect, updateUserPushToken);

export default router;
