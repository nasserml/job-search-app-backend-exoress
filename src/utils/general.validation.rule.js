import Joi from 'joi';
import { Types } from 'mongoose';

/**
 * Validate if the given value is a valid ObjectId.
 * 
 * @function
 * @param {string} value - The value to be validated.
 * @param {object} helper - The Joi validation helper. 
 * @returns {string} The validated ObjectId or an error message if validation fails.
 */
const objectValidation = (value, helper) => {

    // Check if the value is a valid ObjectId
    const isValid = Types.ObjectId.isValid(value);
    
    // Return the validated ObjectId or an error message
    return (isValid) ? value : helper.message('Invalid objectId');
};


/**
 * Validation rules for common scenarios used across the application.
 * 
 * @constant
 * @type {Object}
 * @property {Joi.string} dbId - Joi schema for validation MongoDB ObjectId strings.
 * @property {Joi.object} headersRules - Joi schema for validation request headers.
 */
export const generalRules = {
    dbId: Joi.string().custom(objectValidation),
    headersRules: Joi.object({
        accesstoken: Joi.string().required(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        'user-agent': Joi.string().required(),
        host: Joi.string().required(),
        'accept-encoding': Joi.string(),
        'postman-token': Joi.string(),
        accept: Joi.string(),
        connection: Joi.string(),
        'cache-control': Joi.string()
    })
};