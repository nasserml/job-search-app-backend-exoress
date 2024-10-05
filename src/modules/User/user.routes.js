import { Router } from "express";
import * as userController from "./user.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { forgetPasswordUserSchema, getAccountsWithRecoveryEmailSchema, resetPasswordUserSchema, signInSchema, signUpSchema, updatePassordUserSchema, updateUserSchema } from "./user.validationSchemas.js";
import { endPointsRoles } from "./user.endpoints.roles.js";

const userRouter = Router();

/**
 * Route: POST user/sign-up
 * Description: Endpoint for user registration.
 */
userRouter.post('/sign-up', validationMiddleware(signUpSchema), expressAsyncHandler(userController.signUpAPI));

/**
 * Route: POST user/sign-in
 * Description: Endpoint for user login.
 */
userRouter.post('/sign-in', validationMiddleware(signInSchema), expressAsyncHandler(userController.signInAPI));

/**
 * Route: PUT user/update
 * Description: Endpoint for updating user.
 */
userRouter.put('/update',auth(endPointsRoles.UPDDATE), validationMiddleware(updateUserSchema), expressAsyncHandler(userController.updateUserAPI));

/**
 * Route: DELETE user/delete
 * Description: Endpoint for deleting user.
 */
userRouter.delete('/delete', auth(endPointsRoles.DELETE), expressAsyncHandler(userController.deleteAccountAPI));

/**
 * Route: GET user/user-data
 * Description: Endpoint for getting user data.
 */
userRouter.get('/user-data' , auth(endPointsRoles.USER_DATA), expressAsyncHandler(userController.getUserDataAPI));

/**
 * Route: GET user/user-profile-data
 * Description: Endpoint for getting user profile data.
 */
userRouter.get('/user-profile-data/:userID', expressAsyncHandler(userController.getUserProfileDataAPI));

/**
 * Route: PATCH user/update-password
 * Description: Endpoint for updating user password.
 */
userRouter.patch('/update-password',auth(endPointsRoles.UPDATE_PASSWORD), validationMiddleware(updatePassordUserSchema), expressAsyncHandler(userController.updatePasswordAPI));

/**
 * Route: POST user/forget-password
 * Description: Endpoint for user forget password.
 */
userRouter.post('/forget-password', validationMiddleware(forgetPasswordUserSchema),expressAsyncHandler(userController.forgetPasswordAPI));

/**
 * Route: PATCH user/reset-password
 * Description: Endpoint for user reset password.
 */
userRouter.patch('/reset-password', validationMiddleware(resetPasswordUserSchema), expressAsyncHandler(userController.resetPasswordUserAPI));

/**
 * Route: GET user/get-accounts-with-recovery-email
 * Description: Endpoint for getting accounts with recovery email.
 */
userRouter.get('/get-accounts-with-recovery-email', auth(endPointsRoles.GET_ACCOUNTS_WITH_RECOVERY_EMAIL), validationMiddleware(getAccountsWithRecoveryEmailSchema),expressAsyncHandler(userController.getAccountsWithRecobveryEmailAPI));

export default userRouter;