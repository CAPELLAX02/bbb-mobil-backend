import express from 'express';
import {
  authAdminUser,
  logoutAdminUser,
  getAllUsers,
  getUserById,
  deleteUser,
  banUser,
  unbanUser,
  getAllIssues,
  solveIssue,
  unsolveIssue,
  deleteIssue,
  getAdminProfile,
  sendNotification,
  sendPositiveFeedback,
  sendNegativeFeedback,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
// import { uploadFeedback } from '../config/feedbackMulterConfig.js';

const router = express.Router();

// Authentication Routes for Admin Users
router.post('/auth', authAdminUser);
router.post('/logout', logoutAdminUser);
router.get('/profile', protect, admin, getAdminProfile);

// User Routes for Admin Users
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/ban', protect, admin, banUser);
router.put('/users/:id/unban', protect, admin, unbanUser);

// Issue Routes for Admin Users
router.get('/issues', protect, admin, getAllIssues);
router.post('/issues/:id/solve', protect, admin, solveIssue);
router.post('/issues/:id/unsolve', protect, admin, unsolveIssue);
router.delete('/issues/:id', protect, admin, deleteIssue);

// Feedback and Notification Routes for Admin Users
router.post('/issues/:id/send-notification', protect, admin, sendNotification);

router.post(
  '/issues/:id/send-positive-feedback',
  protect,
  admin,
  // uploadFeedback.single('feedbackPhoto'),
  sendPositiveFeedback
);

router.post(
  '/issues/:id/send-negative-feedback',
  protect,
  admin,
  // uploadFeedback.single('feedbackPhoto'),
  sendNegativeFeedback
);

export default router;
