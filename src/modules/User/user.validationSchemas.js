import Joi from 'joi';
import { systemRoles } from '../../utils/systemRoles.js';
import moment from 'moment';
/**
 * Custome validation function for validating date format (yyyy-mm-dd) using moment.
 * 
 * @param {string} value - The date string to be validated. 
 * @param {Object} helpers - The Joi validation helper. 
 * @returns {string} The validated date string or an error message if validation fails.
 */
const validateDateFormat = (value, helpers) => {
    const isValidDate = moment(value, 'YYYY-MM-DD', true).isValid();

    if (isValidDate) {
        return value;
    } else {
        return helpers.message('Invalid date format. Use yyyy-mm-dd.');
    }
};

/**
 * Joi schema for validating user sign-up API endpoint.
 * 
 * @constant
 * @type {Joi.object}
 * @property {Joi.object} body - Object representing the request body.
 * @property {Joi.string} body.firstName - Joi schema for validating first name.
 * @property {Joi.string} body.lastName - Joi schema for validating last name.
 * @property {Joi.string} body.email - Joi schema for validating email.
 * @property {Joi.string} body.password - Joi schema for validating password.
 * @property {Joi.string} body.cpass - Joi schema for validating confirm password.
 * @property {Joi.string} body.recoveryEmail - Joi schema for validating recovery email.
 * @property {Joi.date} body.DOB - Joi schema for validating date of birth.
 * @property {Joi.string} body.mobileNumber - Joi schema for validating mobile number.
 * @property {Joi.string} body.role - Joi schema for validating role.
 * @property {Joi.string} body.status - Joi schema for validating status.
 * 
 * @throws {Joi.ValidationError} If the request body does not match the schema.
 */
export const signUpSchema = {
    body: Joi.object({
        firstName: Joi.string().min(2).regex(/^[a-zA-Z\s]{2,}$/i).required().messages({'any.required': 'Please enter your first name'}),
        lastName: Joi.string().min(2).regex(/^[a-zA-Z\s]{2,}$/i).required().messages({'any.required': 'Please enter your last name'}),
        email: Joi.string().email({tlds: {allow: ['com', 'net', 'org', 'gov' , 'yahoo']}, minDomainSegments: 1}).required(),
        password: Joi.string().required().messages({'any.required': 'Please enter your password'}),
        cpass: Joi.string().valid(Joi.ref('password')).messages({'any.only': 'Password does not match'}), // ensure that the cpass must be equal to password
        recoveryEmail: Joi.string().email({tlds: {allow: ['com', 'net', 'org', 'gov' , 'yahoo']}, minDomainSegments: 1}).required().messages({'any.required': 'Please enter your recovery email'}),
        DOB:Joi.string().custom(validateDateFormat).required().messages({'any.required': 'Please enter your date of birth'}),
        mobileNumber: Joi.string().min(7).max(15).pattern(/^[0-9]{7,15}$/).required().messages({'any.required': 'Please enter your mobile number'}),
        role: Joi.string().valid(systemRoles.USER, systemRoles.COMPANY_HR).required().messages({'any.required': 'Please enter your role'}),
        status: Joi.string().valid('online', 'offline').required().messages({'any.required': 'Please enter your status'})
    }).with('password', 'cpass').with('email', 'password')
};


/**
 * Joi schema for validating user sign-in API endpoint.
 * 
 * @constant
 * @type {Joi.object}
 * @property {Joi.object} body - Object representing the request body.
 * @property {Joi.string} body.email - Joi schema for validating email.
 * @property {Joi.string} body.mobileNumber - Joi schema for validating mobile number.
 * @property {Joi.string} body.password - Joi schema for validating password.
 * 
 * @throws {Joi.ValidationError} If the request body does not match the schema.
 */
export const signInSchema = {
    body: Joi.object({
        email: Joi.string().email({tlds: {allow: ['com', 'net', 'org', 'gov' , 'yahoo']}, minDomainSegments: 1}),
        mobileNumber: Joi.string().min(7).max(15).pattern(/^[0-9]{7,15}$/),
        password: Joi.string().required().messages({'any.required': 'Please enter your password'})
    }).with('email', 'password').with('mobileNumber', 'password').or('email', 'mobileNumber') // allow either email or mobileNumber to be present in the request body
}

/**
 * Joi schema for validating user update API endpoint.
 * 
 * @constant
 * @type {Joi.object}
 * @property {Joi.object} body - Object representing the request body.
 * @property {Joi.string} body.firstName - Joi schema for validating first name.
 * @property {Joi.string} body.lastName - Joi schema for validating last name.
 * @property {Joi.string} body.email - Joi schema for validating email.
 * @property {Joi.string} body.mobileNumber - Joi schema for validating mobile number.
 * @property {Joi.string} body.recoveryEmail - Joi schema for validating recovery email.
 * @property {Joi.date} body.DOB - Joi schema for validating date of birth.
 * 
 * @throws {Joi.ValidationError} If the request body does not match the schema.
 */
export const updateUserSchema = {
    body: Joi.object({
        firstName: Joi.string().min(2).regex(/^[a-zA-Z\s]{2,}$/i),
        lastName: Joi.string().min(2).regex(/^[a-zA-Z\s]{2,}$/i),
        email: Joi.string().email({tlds: {allow: ['com', 'net', 'org', 'gov' , 'yahoo']}, minDomainSegments: 1}),
        mobileNumber: Joi.string().min(7).max(15).pattern(/^[0-9]{7,15}$/),
        recoveryEmail: Joi.string().email({tlds: {allow: ['com', 'net', 'org', 'gov' , 'yahoo']}, minDomainSegments: 1}),
        DOB:Joi.string().custom(validateDateFormat),
    }).or('firstName', 'lastName','email', 'mobileNumber', 'recoveryEmail', 'DOB').messages(({'object.or': 'Please enter at least one field to update'})) // allow either firstName, lastName, email, mobileNumber, recoveryEmail or DOB, to be present in the request body
}

/**
 * Joi schema for validating user update password API endpoint.
 * 
 * @constant
 * @type {Joi.object}
 * @property {Joi.object} body - Object representing the request body.
 * @property {Joi.string} body.oldPassword - Joi schema for validating old password.
 * @property {Joi.string} body.newPassword - Joi schema for validating new password.
 * @property {Joi.string} body.confirmedNewPassword - Joi schema for validating confirm new password.
 * 
 * @throws {Joi.ValidationError} If the request body does not match the schema.
 */
export const updatePassordUserSchema = {
    body: Joi.object({
        oldPassword: Joi.string().required().messages({'any.required': 'Please enter your old password'}),
        newPassword: Joi.string().required().messages({'any.required': 'Please enter your new password'}),
        confirmedNewPassword: Joi.string().valid(Joi.ref('newPassword')).messages({'any.only': 'Confirm new password does not match with new password'})
    }).with('newPassword', 'confirmedNewPassword')
}

/**
 * Joi schema for validating user forget password API endpoint.
 * @constant
 * @type {Joi.object}
 * @property {Joi.object} body - Object representing the request body.
 * @property {Joi.string} body.email - Joi schema for validating email.
 * @property {Joi.string} body.mobileNumber - Joi schema for validating mobile number.
 * 
 * @throws {Joi.ValidationError} If the request body does not match the schema.
 */
export const forgetPasswordUserSchema = {
    body: Joi.object({
        email: Joi.string().email({tlds: {allow: ['com', 'net', 'org', 'gov' , 'yahoo']}, minDomainSegments: 1}).messages({'any.required': 'Please enter your email'}),
        mobileNumber: Joi.string().min(7).max(15).pattern(/^[0-9]{7,15}$/).messages({'any.required': 'Please enter your mobile number'})
    }).or('email', 'mobileNumber')
}

/**
 * Joi schema for validating user reset password API endpoint.
 * 
 * @constant
 * @type {Joi.object}
 * @property {Joi.object} body - Object representing the request body.
 * @property {Joi.string} body.OTP - Joi schema for validating OTP.
 * @property {Joi.string} body.newPassword - Joi schema for validating new password.
 * @property {Joi.string} body.confirmedNewPassword - Joi schema for validating confirm new password.
 * 
 * @throws {Joi.ValidationError} If the request body does not match the schema.
 */
export const resetPasswordUserSchema = {
    body: Joi.object({
        OTP: Joi.string().required().messages({'any.required': 'Please enter your OTP'}),
        newPassword: Joi.string().required().messages({'any.required': 'Please enter your new password'}),
        confirmedNewPassword: Joi.string().valid(Joi.ref('newPassword')).messages({'any.only': 'Confirm new password does not match with new password'})
    }).with('newPassword', 'confirmedNewPassword')
}

/**
 * Joi schema for validating user get account with recovery email API endpoint.
 * 
 * @constant
 * @type {Joi.object}
 * @property {Joi.object} body - Object representing the request body.
 * @property {Joi.string} body.recoveryEmail - Joi schema for validating recovery email.
 * 
 * @throws {Joi.ValidationError} If the request body does not match the schema.
 */
export const getAccountsWithRecoveryEmailSchema = {
    body: Joi.object({
        recoveryEmail: Joi.string().required().email({tlds: {allow: ['com', 'net', 'org', 'gov' , 'yahoo']}, minDomainSegments: 1}).messages({'any.required': 'Please enter your recovery email'}),
    })
}