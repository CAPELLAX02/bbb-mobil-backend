import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

/**
 * Middleware to protect routes and ensure user is authenticated.
 * Verifies JWT from the Authorization header and attaches user to request object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // HTTP-Only Cookie'den token kontrolü (Admin (web) için)
  if (req.cookies && req.cookies['adminToken']) {
    token = req.cookies['adminToken'];
    try {
      // Admin token'ı doğrulama
      const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Admin token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  // Authorization header üzerinden token kontrolü (Normal kullanıcı (mobil) için)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Kullanıcı token'ı doğrulama
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Burada JWT_SECRET kullanıldığına dikkat edin
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('User token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

/**
 * Middleware to check if the authenticated user is an admin.
 * Blocks access if the user is not an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
