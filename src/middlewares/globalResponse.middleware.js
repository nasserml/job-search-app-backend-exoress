
/**
 * Middleware for handling global error responses.
 * 
 * @function
 * @param {Error} err - The Error object to be handled.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Object} JSON response with error details.
 */
export const globalResponse = (err, req, res, next) => {
    if(err) {
        // Respond with an error JSON containing error details.
        return res.status(err['cause'] || 500).json({
            message: 'Catch Error',
            errorMessage: err.message,
            errorLocation: err.stack
        });
    }
};