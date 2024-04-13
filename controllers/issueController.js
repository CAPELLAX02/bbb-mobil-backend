import asyncHandler from '../middleware/asyncHandler.js';
import Issue from '../models/issueModel.js';
import User from '../models/userModel.js';

/**
 * @desc    Fetch single issue by ID
 * @route   GET /api/issues/:id
 * @access  Private
 */
const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (issue) {
    return res.json(issue);
  }

  res.status(404).json({ message: 'Issue not found' });
  throw new Error('Resource not found');
});

/**
 * @desc    Create a new issue
 * @route   POST /api/issues
 * @access  Private
 */
const createIssue = asyncHandler(async (req, res) => {
  const issue = new Issue({
    user: req.user._id,
    title: req.body.title,
    code: req.body.code,
    description: req.body.description,
    image: req.body.image,
    address: req.body.address,
  });

  const createdIssue = await issue.save();
  res.status(201).json(createdIssue);
});

/**
 * @desc    Get current user's issues
 * @route   GET /api/issues/myissues
 * @access  Private
 */
const getMyIssues = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const myIssues = await Issue.find({ user: user });

  res.json({
    userName: user.name,
    userId: user._id,
    userIssues: myIssues,
  });
});

export { getIssueById, createIssue, getMyIssues };
