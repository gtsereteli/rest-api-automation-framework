/**
 * Wraps an asynchronous function to handle errors gracefully.
 *
 * @param {Function} fn - The asynchronous function to be guarded.
 *
 * @returns {Promise<*>} - Resolves with the result of the function if successful,
 *                         or rejects with the caught error if an error occurs.
 */
const guard = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    return error;
  }
};

module.exports = guard;
