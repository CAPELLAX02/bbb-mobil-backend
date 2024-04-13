import express from 'express';
import {
  // getAllIssues,
  getIssueById,
  createIssue,
  // deleteIssue,
  getMyIssues,
  // solveIssue,
  // unsolveIssue,
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';

// Initialize the router
const router = express.Router();

router.route('/').post(protect, createIssue); // for authenticated users

router.route('/myissues').get(protect, getMyIssues); // for authenticated users

router.route('/:id').get(protect, getIssueById); // for authenticated users

export default router;
