import {Router} from 'express';
import * as jobController from './job.controller.js';

import expressAsyncHandler  from 'express-async-handler';
import { auth } from '../../middlewares/auth.middleware.js';
import { endPointsRoles } from './job.endpoints.roles.js';
import { allowedExtensions } from '../../utils/allowedExtensions.js';
import { multerMiddleHost } from '../../middlewares/multer.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import { addJobSchema, applyJobSchema, deleteJobSchema, getAllJobsSpecificCompanySchema, getJobsFilterSchema, updateJobSchema } from './job.validationSchemas.js';


const jobRouter = Router();

jobRouter.post('/add-job', auth(endPointsRoles.ADD_JOB), validationMiddleware(addJobSchema), expressAsyncHandler(jobController.addJobAPI));

jobRouter.put('/update-job/:jobId', auth(endPointsRoles.UPDATE_JOB), validationMiddleware(updateJobSchema), expressAsyncHandler(jobController.updateJobAPI));

jobRouter.delete('/delete-job/:jobId', auth(endPointsRoles.DELETE_JOB),validationMiddleware(deleteJobSchema), expressAsyncHandler(jobController.deleteJobAPI));

jobRouter.get('/get-all-jobs-with-company', auth(endPointsRoles.GET_ALL_JOBS_COMPANY), expressAsyncHandler(jobController.getAllJobsWithCompanyAPI));

jobRouter.get('/get-all-jobs-specific-company', auth(endPointsRoles.GET_ALL_JOBS_SPECIFIC_COMPANY), validationMiddleware(getAllJobsSpecificCompanySchema), expressAsyncHandler(jobController.getAllJobsForSpecificCompanyAPI));

jobRouter.get('/get-jobs-filters', auth(endPointsRoles.GET_JOBS_FILTER), validationMiddleware(getJobsFilterSchema), expressAsyncHandler(jobController.getJobsWithFiltersAPI));

jobRouter.post('/apply-job', auth(endPointsRoles.APPLY_JOB),multerMiddleHost({extensions: allowedExtensions.resume_pdf}).single('resume'), expressAsyncHandler(jobController.applyForJobAPI));

export default jobRouter;