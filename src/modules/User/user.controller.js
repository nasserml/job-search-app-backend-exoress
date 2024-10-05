import userModel from "../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { createDocumnetByCreate, deleteDocumentByFindByIdAndDelete, findDocumentByFindById, findDocumentByFindOne, updateDocumentByFinByIdAndUpdate } from "../../../DB/dbMethods.js";
import generateOTP from "../../utils/generateOTP.js";

//================================= SignUp API =====================//
/***
 * destructuring data from req.body
 * check email is already exists
 * if exists return error
 * check if mobile number is already exists
 * if exists return error
 * hash password
 * concat first and last name and assign it to username
 * create new user
 * return success response
 */
/**
 * Sign up API endpoint for creating a new user.
 * 
 * @function
 * @async
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the newly created user.
 *
 * @throws {Error} If email or mobile number already exists, returns a conflict error (HTTP status code 409).
 * @throws {Error} If any other error occurs during user creation, returns an internal server error (HTTP status code 500).
 */
export const signUpAPI = async (req, res, next) => {

    // Destructure the needed data from the request body
    const {firstName, lastName, email, password, recoveryEmail,DOB, mobileNumber, role, status} = req.body;

    // Check if the email already exists in the database
    const isEmailExists = await findDocumentByFindOne(userModel, {email});
    if(isEmailExists.success) return next(new Error('Email already exists', {cause:409})); // If the email already exists, return an error with status code 409

    // Check if the mobileNumber already exists in the database
    const isMobileNumberExists = await findDocumentByFindOne(userModel, {mobileNumber});
    if(isMobileNumberExists.success) return next(new Error('Mobile number already exists', {cause:409})); // If the mobileNumber already exists, return an error with status code 409

    // Hash the password using bcryptjs and salt rounds specified in the environment variables
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

    // Create a username from the first and last name
    const username = `${firstName} ${lastName}`;

    // Create a new user document in the database
    const newUser = await createDocumnetByCreate(userModel, {firstName, lastName,username,  email, password: hashedPassword, recoveryEmail, DOB, mobileNumber, role, status});

    // Send a success response with the newly created user
    return res.status(newUser.status).json({message: 'User created successfully', newUser}); 
}

//================================= SignIn API =====================//
/***
 * destructuring data from req.body
 * check user is already exists
 * if not exists return error
 * check password
 * if not match return error
 * generate token
 * set status to online
 * update user
 * return success response
 */
/**
 * Sign in API endpoint for user login.
 * 
 * @function
 * @async
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the logged in user and token.
 * 
 * @throws {Error} If invalid login credentials, returns a not found error (HTTP status code 404).
 * @throws {Error} If any other error occurs during user login, returns an internal server error (HTTP status code 500).
 */
export const signInAPI = async (req, res, next) => {
    
    // Destructure the needed data from the request body
    const {email, mobileNumber,password} = req.body;
    
    // Check if the user exists in the database
    const isUserExists = await findDocumentByFindOne(userModel, { $or: [{email}, {mobileNumber}]});

    // If the user does not exist, return an error with status code 404
    if(!isUserExists.success) return next(new Error('Invalod login credentials', {cause:404}));

    // Check if the password is correct
    const isPasswordMatched = bcrypt.compareSync(password, isUserExists.isDocumentExists.password);

    // If the password is incorrect, return an error with status code 404
    if (!isPasswordMatched) return next(new Error('Invalod login credentials', {cause:404}));

    // Generate a token with the user's id, email, and mobileNumber
    const token = jwt.sign({id: isUserExists.isDocumentExists._id, userEmail: isUserExists.isDocumentExists.email, mobileNumberUser: isUserExists.isDocumentExists.mobileNumber }, process.env.LOGIN_SIGNATURE, { expiresIn:'3d'});

    // Update the user's status to 'online' in the database
    isUserExists.isDocumentExists.status = 'online';
    await isUserExists.isDocumentExists.save();

    // Send a success response with the logged in user and token
    return res.status(isUserExists.status).json({message: 'User LoggedIn successfully', token});

};

//================================= Update User API =====================//
/***
 * destructuring data from req.body
 * check if email already exists
 * if it exist return error
 * check if mobile number already exists
 * if it exist return error
 * check if user exists
 * if not exist return error
 * update user
 * return success response
 */
/**
 * Update user API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the updated user.
 * 
 * @throws {Error} If email already exists, returns a conflict error (HTTP status code 409).
 * @throws {Error} If mobile number already exists, returns a conflict error (HTTP status code 409). 
 * @throws {Error} If user not found, returns a not found error (HTTP status code 404).
 */
export const updateUserAPI = async (req, res, next) => {
    
    // Destructure the needed data from the request body
    const {firstName, lastName,email, mobileNumber, recoveryEmail, DOB} = req.body;
    
    // Get the user ID from the authenticated user
    const {_id} = req.authUser;

    // Check if the provided email already exists in the database
    if(email) {
        
        // Check if the email already exists
        const isEmailExists = await findDocumentByFindOne(userModel,{email});
        
        // If the email already exists, return an error with status code 409
        if(isEmailExists.success) return next(new Error('Email already exists', {cause:409}));
    }

    // Check if the provided mobile number already exists in the database
    if(mobileNumber) {

        // Check if the mobile number already exists
        const isMobileNumberExists = await findDocumentByFindOne(userModel, {mobileNumber});

        // If the mobile number already exists, return an error with status code 409
        if(isMobileNumberExists.success) return next(new Error('Mobile number already exists', {cause:409}));
    }

    // Find the user by ID and exclude the password field from the result
    const updatedUser = await findDocumentByFindById(userModel,_id, '-password');

    // If the user does not exist, return an error with status code 404
    if(!updatedUser.success) return next(new Error('User not found', {cause:404}));

    // Update the user fields with provided values or keep the existing values if not provided
    // Update the user firstName field
    updatedUser.isDocumentExists.firstName = firstName || updatedUser.isDocumentExists.firstName;

    // Update the user lastName field
    updatedUser.isDocumentExists.lastName = lastName || updatedUser.isDocumentExists.lastName;

    // Update the user email field
    updatedUser.isDocumentExists.email = email || updatedUser.isDocumentExists.email;

    // Update the user mobileNumber field
    updatedUser.isDocumentExists.mobileNumber = mobileNumber || updatedUser.isDocumentExists.mobileNumber;

    // Update the user recoveryEmail field
    updatedUser.isDocumentExists.recoveryEmail = recoveryEmail || updatedUser.isDocumentExists.recoveryEmail;
    
    // Update the user DOB field
    updatedUser.isDocumentExists.DOB = DOB || updatedUser.isDocumentExists.DOB;

    // Update the user username field
    updatedUser.isDocumentExists.username = `${updatedUser.isDocumentExists.firstName} ${updatedUser.isDocumentExists.lastName}`;

    // Save the updated user
    await updatedUser.isDocumentExists.save();

    // Send a success response with the updated user
    return res.status(updatedUser.status).json({message: 'User updated successfully',user: updatedUser.isDocumentExists});

}

//================================= Delete User API =====================//
/***
 * get user ID from the authenticated user
 * delete user by ID
 * if any error occurs during user deletion, return an error with status code 500
 * return success response
 */
/**
 * Delete account API endpoint.
 * 
 * @param {import('express').Request} req - Express request object. 
 * @param {import('express').Response} res - Express response object. 
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the deleted user.
 * 
 * @throws {Error} If any error occurs during user deletion, returns an internal server error (HTTP status code 500).
 */
export const deleteAccountAPI = async(req, res, next) => {

    // Get the user ID from the authenticated user
    const {_id} = req.authUser;

    // Delete the user by ID 
    const deletedUser = await deleteDocumentByFindByIdAndDelete(userModel, _id);

    // If any error occurs during user deletion, return an error with status code 500
    if(!deletedUser.success) return next(new Error('Deleted failed', {cause:500}));

    // Send a success response with the deleted user
    res.status(deletedUser.status).json({message: 'User deleted successfully', deletedUser});
}

//================================= get User Data API =====================//
/***
 * get user ID from the authenticated user
 * find user by ID and exclude the password field from the result
 * if user not found, return an error with status code 404
 * return success response
 */
/**
 * Get user data API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the user profile.
 * 
 * @throws {Error} If any error occurs during user profile retrieval, returns an internal server error (HTTP status code 500).
 */
export const getUserDataAPI = async (req, res, next) => {

    // Get the user ID from the authenticated user
    const {_id} = req.authUser;

    // Find the user by ID and exclude the password field from the result
    const userData = await findDocumentByFindById(userModel, _id, '-password');

    // If any error occurs during user profile retrieval, return an error with status code 500
    if(!userData.success) return next(new Error('Database error', {cause:500}));
    
    // Send a success response with the user profile
    res.status(userData.status).json({messga:'User data', data:userData.isDocumentExists});
}

//================================= Get User Profile Data API =====================//
/***
 * get user ID from the request params
 * find user by ID and include firstName, lastName, email, mobileNumber, username, status, role in the result
 * if user not found, return an error with status code 404
 * return success response
 */
/**
 * Get user profile data API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object. 
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the user profile.
 * 
 * @throws {Error} If any error occurs during user profile retrieval, returns an internal server error (HTTP status code 500).
 */
export const getUserProfileDataAPI = async (req, res, next) => {

    // Get the user ID from the request params
    const {userID} = req.params;

    // Find the user by ID and include firstName, lastName, email, mobileNumber, username, status, role in the result
    const userData = await findDocumentByFindById(userModel,userID, 'firstName lastName email mobileNumber username status role');

    // If any error occurs during user profile retrieval, return an error with status code 500
    if(!userData.success) return next(new Error('User not found', {cause:404}));

    // Send a success response with the user profile
    res.status(userData.status).json({message: 'User profile', userData: userData.isDocumentExists})
}

//================================= Update User Password API =====================//
/***
 * get user ID from the authenticated user
 * destructure the needed data from the request body
 * find user by ID
 * if user not found, return an error with status code 404
 * check if old password matches
 * if not, return an error with status code 404
 * hash the new password
 * update the user password
 * return success response
 */
/**
 * Update password API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object. 
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the updated password and user profile.
 * 
 * @throws {Error} If any error occurs during user profile retrieval, returns an internal server error (HTTP status code 500).
 */
export const updatePasswordAPI = async (req, res, next) => {

    // Get the user ID from the authenticated user
    const {_id} = req.authUser;

    // Destructure the needed data from the request body
    const {oldPassword, newPassword} = req.body;

    // Find the user by ID 
    const updatedUser = await findDocumentByFindById(userModel,_id);

    // If any error occurs during user profile retrieval, return an error with status code 500
    if(!updatedUser.success) return next(new Error('User not found', {cause:404}));

    // Check if the old password is correct using bcrypt compareSync
    const isPasswordMatched = bcrypt.compareSync(oldPassword, updatedUser.isDocumentExists.password);

    // If the old password is incorrect, return an error with status code 404
    if(!isPasswordMatched) return next(new Error('Invalid old password', {cause:404}));

    // Hash the new password using bcryptjs and salt rounds specified in the environment variables
    const hashNewPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);

    // Update the user's password in the database
    updatedUser.isDocumentExists.password = hashNewPassword;
    
    // Save the updated user
    await updatedUser.isDocumentExists.save();

    // Convert the updated user to an object
    const updatedUserObject= updatedUser.isDocumentExists.toObject()
    
    // Remove unnecessary fields from the updated user object
    // delete password field
    delete updatedUserObject.password;

    // delete createdAt fields
    delete updatedUserObject.createdAt;

    // delete updatedAt field
    delete updatedUserObject.updatedAt;

    // delete __v field
    delete updatedUserObject.__v;
    
    // Send a success response with the updated password and user profile
    res.status(updatedUser.status).json({message: 'Password updated successfully', updatedUser:updatedUserObject});
}

//================================= Forget User Password API =====================//
/***
 * destructuring data from req.body
 * check if user exists
 * if not exist return error
 * generate an OTP
 * generate a reset token with 15 minutes expiry time
 * return success response
 */
/**
 * Forget password API endpoint
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object. 
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the OTP and reset token.
 * 
 * @throws {Error} If user not found, returns an error with status code 404.
 */
export const forgetPasswordAPI = async (req, res, next) => {

    // Destructure the needed data from the request body
    const {email, mobileNumber} = req.body;

    // Check if the user exists in the database
    const isUserExists = await findDocumentByFindOne(userModel, {$or : [{email}, {mobileNumber}]});

    // If the user does not exist, return an error with status code 404
    if(!isUserExists.success) return next(new Error('User not found', {cause:404}));
    
    // Generate an OTP
    const OTP = generateOTP();

    // Generate a reset token with 15 minutes expiry
    const resetToken = jwt.sign({ _id: isUserExists.isDocumentExists._id, email: isUserExists.isDocumentExists.email, mobileNumber: isUserExists.isDocumentExists.mobileNumber ,OTP}, process.env.RESET_PASSWORD_SIGNATURE, {expiresIn:'15m'});

    // Send a response to the user with the OTP and reset token
    res.status(200).json({message: 'OTP and reset token generated successfully and expires in 15 minutes', OTP, resetToken});
}

//================================= Reset  User Password API =====================//
/***
 * destructuring data from req.headers
 * destructuring data from req.body
 * check if reset token is valid
 * if not valid return error
 * check if OTP is valid
 * if not valid return error
 * hash the new password
 * update the user's password in the database
 * if any error occurs during udating the password return error
 * return success response
 */
/**
 * Reset password API endpoint
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object. 
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the updated password.
 * 
 * @throws {Error} If reset token is invalid or expired, returns an error with status code 404.
 * @throws {Error} If the OTP is invalid or expired, returns an error with status code 404.
 * @throws {Error} If any error occurs during udating the password, returns an error with status code 404.
 */
export const resetPasswordUserAPI = async (req, res, next) => {
    
    // Destructure the resettoken from the request headers
    const {resettoken} = req.headers;

    // Destructure the OTP and new password from the request body
    const  {OTP, newPassword} = req.body;

    // Verify the reset token
    const decodedToken = jwt.verify(resettoken, process.env.RESET_PASSWORD_SIGNATURE);
    
    // Check if the reset token is valid
    if(!decodedToken || !decodedToken._id) return next(new Error('Invalid reset token payload', {cause:404})); // If the reset token is invalid, return an error with status code 404
    
    // Check if the OTP is valid and not expired
    if(decodedToken.OTP !== OTP) return next(new Error('Invalid OTP', {cause:404})); // If the OTP is invalid, return an error with status code 404

    // Hash the new password using bcryptjs and salt rounds specified in the environment variables
    const hashNewPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);

    // Update the password in the database
    const updatedUser = await updateDocumentByFinByIdAndUpdate(userModel,decodedToken._id,{password:hashNewPassword});

    // If any error occurs during updating the password, return an error with status code 404
    if(!updatedUser.success) return next(new Error('Failed to reset the password', {cause:404}));

    // Send a success response with the updated password
    res.status(updatedUser.status).json({message: 'Password reset successfully', updatedUser:updatedUser});
}

//================================= Get Accounts With recovery Email API =====================//
/***
 * destructuring data from req.body
 * find user accounts with the recovery email in the database and exclude the password, _id, _v, createdAt and updatedAt fileds
 * if user not found, return an error with status code 404
 * return success response
 */
/**
 * Get accounts with recovery email API endpoint
 * 
 *@param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object. 
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the user accounts.
 * 
 * @throws {Error} If user not found, returns an error with status code 404.
 */
export const getAccountsWithRecobveryEmailAPI = async (req, res, next) => {
    
    // Destructure the recovery email from the request body
    const {recoveryEmail} = req.body;

    // Find the user accounts with the recovery email in the database and exclude the password, _id, _v, createdAt and updatedAt fileds
    const userAccounts = await userModel.find({recoveryEmail}).select('-password -_id -_v -createdAt -updatedAt -__v'); 
    
    // If user not found, return an error with status code 404
    if(!userAccounts) return next(new Error('Users not found', {cause:404})); // If user not found, return an error with status code 404

    // Send a success response with the user accounts
    res.status(200).json({message: 'User found', userAccounts: userAccounts});
}






