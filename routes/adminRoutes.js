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
router.get('/profile', getAdminProfile);

// User Routes for Admin Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);

// Issue Routes for Admin Users
router.get('/issues', getAllIssues);
router.post('/issues/:id/solve', solveIssue);
router.post('/issues/:id/unsolve', unsolveIssue);
router.delete('/issues/:id', deleteIssue);

// Feedback and Notification Routes for Admin Users
router.post('/issues/:id/send-notification', sendNotification);

router.post(
  '/issues/:id/send-positive-feedback',
  // uploadFeedback.single('feedbackPhoto'),
  sendPositiveFeedback
);

router.post(
  '/issues/:id/send-negative-feedback',
  // uploadFeedback.single('feedbackPhoto'),
  sendNegativeFeedback
);

export default router;
