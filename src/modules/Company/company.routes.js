import { Router } from "express";
import * as companyController from "./company.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { endPointsRoles } from "./company.endpoints.roles.js";
import { addCompanySchema,updateCompanySchema, deleteCompanySchema, getCompanyDataSchema, searchCompanyNameSchema, getApplicationJobsSchema, getApplicationsCompanyDaySchema } from "./company.validationSchemas.js";

const companyRouter = Router();

companyRouter.post('/add-company', auth(endPointsRoles.ADD_COMPANY),validationMiddleware(addCompanySchema), expressAsyncHandler(companyController.addCompanyAPI));

companyRouter.put('/update-company/:companyId', auth(endPointsRoles.UPDATE_COMPANY), validationMiddleware(updateCompanySchema),expressAsyncHandler(companyController.updateCompanyAPI));

companyRouter.delete('/delete-company/:companyId', auth(endPointsRoles.DELETE_COMPANY), validationMiddleware(deleteCompanySchema),expressAsyncHandler(companyController.deleteCompanyAPI));

companyRouter.get('/get-company-data/:companyId',auth(endPointsRoles.GET_COMPANY_DATA) ,validationMiddleware(getCompanyDataSchema),expressAsyncHandler(companyController.getCompanyDataAPI));

companyRouter.get('/search-company-name', auth(endPointsRoles.SEARCH_COMPANY_BY_NAME),validationMiddleware(searchCompanyNameSchema),expressAsyncHandler(companyController.searchCompanyByNameAPI));

companyRouter.get('/get-application-jobs/:companyName', auth(endPointsRoles.GET_APPLICATION_JOBS), validationMiddleware(getApplicationJobsSchema), expressAsyncHandler(companyController.getApplicationsForJobsAPI));

companyRouter.get('/get-applications-company-day/:companyName/:date', auth(endPointsRoles.GET_APPLICATIONS_COMPANY_NAME), validationMiddleware(getApplicationsCompanyDaySchema), expressAsyncHandler(companyController.getAllApplicationsCompanyDayAPI));

export default companyRouter;