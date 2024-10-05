import {Schema, model} from 'mongoose';

/**
 * Validates whether a given email address is in a valid format.
 * 
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 * 
 * @description
 * This function uses a regular expression to check if the provided email address adheres to
 * a common email format. It returns true if the email is valid and false otherwise. The validation
 * is based on regular expression pattern commonly used to validate email addresses.
 * 
 * Example usage:
 * ```javascript
 * const isValidEmail = validateEmail('user@example.com');
 * if (isValidEmail) {
 *     console.log('The email is valid');
 * } else {
 *     console.log('Invalid email format');
 * }
 */
const validateEmail = (email) =>  {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

/**
 * Mongoose schema definition for the company model.
 * 
 * @typedef {Object} companySchema
 * @property {string} companyName - The name of the company. Must be unique. Required.
 * @property {string} description - The description of the company. Required.
 * @property {string} industry - The industry to which the company belongs. Required.
 * @property {string} address - The address of the company. Required.
 * @property {string} numberOfEmployees - The number of employees in the company. Required.
 * @property {string} companyEmail - The email address of the company. Must be unique and in a valid format. Required.
 * @property {Schema.Types.ObjectId} companyHR - The MongoDB ObjectId reference to the User model for the company's HR.
 */
const companySchema = new Schema({
    companyName: {type: String, required: true, unique: true},
    description: {type:String, required: true},
    industry:{type: String, required: true},
    address:{type: String, required: true},
    numberOfEmployees: {type: String, required: true},
    companyEmail: {type: String, required: true, unique: true, lowercase: true, trim: true,validate: {validator: validateEmail,message: "Please enter a valid email" }},
    companyHR:{type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: true});

/**
 * Mongoose model for the company schema.
 * 
 * @typedef {model<companySchema>} companyModel
 */
const companyModel = model('Company', companySchema);

export default companyModel;