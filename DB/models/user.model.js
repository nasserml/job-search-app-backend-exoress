import {Schema, model} from 'mongoose';
import { systemRoles } from '../../src/utils/systemRoles.js';

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
 * Mongoose schema definition for The User model.
 * 
 * @typedef {Object} userSchema
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} username - The username of the user
 * @property {string} email - The email address of the user. Must be unique and in a valid format.
 * @property {string} password - The password of the user.
 * @property {string} recoveryEmail - The recovery email address for the user. Must be in a valid format.
 * @property {Date} DOB - The date of birth of the user.
 * @property {number} mobileNumber - The ,obile number of the user. Must be unique.
 * @property {string} role - The role of the user. Can be 'User' or 'Company_HR'.
 * @property {string} status - The status of the user. Can be 'online' or 'offline'.
 * @property {Date} createdAt - The timestamp when the user document was created.
 * @property {Date} updatedAt - The timestamp when the user document was last updated.
 */
const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type:String, required: true},
    email:{type: String, unique: true, lowercase: true, trim: true,validate: {validator: validateEmail,message: "Please enter a valid email" }, required: [true, "Email required"]},
    password:{type: String, required: true},
    recoveryEmail:{type:String,required: false ,validate: {validator: validateEmail, message: "Please enter a valid email"}},
    DOB:{type: Date, required: true},
    mobileNumber:{type: String, required: true, unique: true},
    role:{type: String, enum:[systemRoles.USER, systemRoles.COMPANY_HR], required: true, default: systemRoles.USER},
    status:{type:String, enum: ['online', 'offline'], required: true, default: 'offline'}
},{timestamps: true});



/**
 * Mongoose model for the User schema.
 *
 * @typedef {model<userSchema>} userModel
 */
const userModel = model('User', userSchema);

export default userModel;