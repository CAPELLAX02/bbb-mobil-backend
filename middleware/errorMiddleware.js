/**
 * Middleware to catch 404 not found errors and forward to error handler.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Error handling middleware to handle all app errors.
 * Formats and sends error response with appropriate status code and message.
 * Hides error stack in production for security.
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    (message = 'Resource not found'), (statusCode = 404);
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? ':)' : err.stack,
  });
};

export { notFound, errorHandler };
