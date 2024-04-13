/**
 * Asynchronous function handler to simplify try-catch blocks in async routes.
 * Automatically catches errors and passes them to the next middleware.
 * @param {Function} myFunction The async function to be handled.
 * @returns {Function} Middleware function executing the async function.
 */
const asyncHandler = (myFunction) => (req, res, next) =>
  Promise.resolve(myFunction(req, res, next)).catch(next);

export default asyncHandler;
