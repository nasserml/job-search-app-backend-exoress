

const reqKeys = ['query', 'body', 'params', 'headers'];

/**
 * loop through reqKeys and validate each key with the schema related to the key
 * if there is any error in validationResult push the error to validationErrorArr after spread it to be 1D array
 * after complete the loop , we check if validationErrorArr.length is greater than 0 then return 400 status code with the error message and the errors array
 * if there is no length then call next()
 */
/**
 * Middleware function to validate request parameters, body, query, and headers against a given schema.
 * If there are any validation errors, it returns a 400 status code wioth the eroor message and the errors array.
 * If there are no validation errors, it calls the next middleware.
 * 
 * @param {Object} schema - Joi schema object for validation. 
 * @returns {Function} Express middleware function.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @throws {Error} If validation fails, an error is passed to the next middleware.
 */
export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        let validationErrorArr = []

        // loop through regKeys and validate each key with the schema related to the key
        for (const key of reqKeys) {
            const validationResult = schema[key]?.validate(req[key], { abortEarly: false });
            if (validationResult?.error) {
                validationErrorArr.push(...validationResult.error.details);
            }
        }

        // If there are validation errors, return a 400 status code with the error message and the errors array 
        if (validationErrorArr.length) {
            return res.status(400).json({
                err_msg: "validation error",
                errors: validationErrorArr.map(ele => ele.message)
            })
        }

        // If there are no validation errors, call the next middleware
        next();
    }
}
