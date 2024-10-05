import jobModel from "../../../DB/models/job.model.js";
import companyModel from "../../../DB/models/company.model.js";
import applicationModel from "../../../DB/models/application.model.js";

import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { createDocumnetByCreate, deleteDocumentByFindByIdAndDelete, findDocumentByFindById, findDocumentByFindOne, updateDocumentByFinByIdAndUpdate } from "../../../DB/dbMethods.js";
import cloudinaryConnection, { deleteFolderInCloudinary } from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generateUniqueString.js";

//================================= AddJob API =====================//
/***
 * destructuring data from req.authUser
 * destructuring data from req.body
 * create new job in the database
 * if any error occurs during job creation return error
 * return success response
 */
/**
 * Add new Job API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function. 
 * @returns {import('express').Response.json} - Returns success response with the new job.
 * 
 * @throws {Error} If any error occurs during job creation, returns an internal server error (HTTP status code 500).
 */
export const addJobAPI = async (req, res, next) => {

    // Destructuring user ID from req.authUser
    const {_id} = req.authUser;

    // Destructuring data from req.body
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, techinicalSkills, softSkills} = req.body;

    // Create new job in the database
    const newJob = await createDocumnetByCreate(jobModel, {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, techinicalSkills, softSkills, addedBy:_id});

    // If any error occurs during job creation return error
    if(!newJob.success) return next(new Error('Error while adding job', {cause:500}));

    // Return success response
    res.status(newJob.status).json({message: 'Job added successfully', newJob: newJob.isDocumentCreated});
}

//================================= UpdateJob API =====================//
/**
 * destructuring job ID from req.params
 * destructuring user ID from req.authUser
 * destructuring data from req.body
 * check if job exist
 * if not exist return error
 * check if user is authorized
 * if not authorized return error
 * update job
 * if any error occurs during job update return error
 * return success response
 */
/**
 * Update Job API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the updated job.
 * 
 * @throws {Error} If job not found, returns an error with status code 404.
 * @throws {Error} If unauthorized access, returns an error with status code 401.
 * @throws {Error} If any error occurs during job update, returns an internal server error (HTTP status code 500).
 */
export const updateJobAPI = async (req, res, next) => {

    // Destructuring job ID from req.params
    const jobId = req.params.jobId;
    
    // Destructuring user ID from req.authUser
    const {_id} = req.authUser;

    // Destructuring data from req.body
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, techinicalSkills, softSkills} = req.body;

    // Check if job exist
    const isJobExist = await findDocumentByFindById(jobModel, jobId);

    // If not exist return error
    if(!isJobExist.success) return next(new Error('Job not found', {cause:404}));

    // Check if user is authorized
    if(isJobExist.isDocumentExists.addedBy.toString() !== _id.toString()) return next(new Error('Unauthorized access', {cause:401}));

    // Update job
    const updatedJob = await updateDocumentByFinByIdAndUpdate(jobModel, jobId, {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, techinicalSkills, softSkills});

    // If any error occurs during job update return error
    if(!updatedJob.success) return next(new Error('Error while updating job', {cause:500}));

    // Return success response
    res.status(updatedJob.status).json({message: 'Job updated successfully', updatedJob: updatedJob.isDocumentUpdated});
}

//================================= DeleteJob API =====================//
/**
 * destructuring user ID from req.authUser
 * destructuring job ID from req.params
 * check if job exist
 * if not exist return error
 * check if user is authorized
 * if not authorized return error
 * delete job
 * if any error occurs during job deletion return error
 * return success response
 */
/**
 * delete Job API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the deleted job.
 * 
 * @throws {Error} If job not found, returns an error with status code 404.
 * @throws {Error} If unauthorized access, returns an error with status code 401.
 * @throws {Error} If any error occurs during job deletion, returns an internal server error (HTTP status code 500).
 * */
export const deleteJobAPI = async (req, res, next) => {
    
    // Destructuring user ID from req.authUser
    const {_id} = req.authUser;

    // Destructuring job ID from req.params
    const {jobId} = req.params;

    // Check if job exist
    const isJobExist = await findDocumentByFindById(jobModel, jobId);

    // If not exist return error
    if(!isJobExist.success) return next(new Error('Job not found', {cause:404}));

    // Check if user is authorized
    if(isJobExist.isDocumentExists.addedBy.toString() !== _id.toString()) return next(new Error('Unauthorized access', {cause:401}));

    // Delete job
    const deletedJob = await deleteDocumentByFindByIdAndDelete(jobModel, jobId);

    // If any error occurs during job deletion return error
    if(!deletedJob.success) return next(new Error('Error while deleting job', {cause:500}));

    // Return success response
    res.status(deletedJob.status).json({message: 'Job deleted successfully', deletedJob: deletedJob.isDocumentDeleted});
}

//================================= Get all Jobs with company  API =====================//
/**
 * find all jobs
 * empty array to store jobs with company information
 * iterate over all jobs
 * find company information
 * convert job to object
 * add company information to job object
 * push job object to jobsCompany array
 * if job not found return error
 * return success response
 */
/**
 * Get all jobs with company information API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the founded jobs with company information.
 * 
 * @throws {Error} If job not found, returns an error with status code 404.
 */
export const getAllJobsWithCompanyAPI = async (req, res, next) => {

    // Find all jobs
    const jobs =  jobModel.find().cursor();

    // empty array to store jobs with company information
    let jobsCompany = []

    // Iterate over all jobs
    for (let job = await jobs.next(); job != null; job = await jobs.next()){

        // Find company information
        const company = await companyModel.find({companyHR: job.addedBy});

        // Convert job to object
        const jobObject = job.toObject();

        // Add company information to job object
        jobObject.companyInformation = company;

        // Push job object to jobsCompany array
        jobsCompany.push(jobObject);
    }

    // If no jobs found return error
    if(!jobsCompany.length) return next(new Error('No jobs found', {cause:404}));
    
    // Return success response with the founded jobs with company information
    res.status(200).json({message: 'Jobs  with compay information found', jobs: jobsCompany});
    
}

//================================= Get all Jobs with specific company name  API =====================//
/**
 * destructuring company name from req.query
 * destructuring user ID from req.authUser
 * check if company exist
 * if not exist return error
 * check if job exist
 * if not exist return error
 * add jobs information to company object
 * return success response
 */
/**
 * Get all jobs with specific company name   API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the founded jobs with company information.
 * 
 * @throws {Error} If job not found, returns an error with status code 404.
 * @throws {Error} If company not found, returns an error with status code 404.
 */
export const getAllJobsForSpecificCompanyAPI = async (req, res, next) => {
    
    // Destructuring company name from req.query
    const {companyName} = req.query;

    // Destructuring user ID from req.authUser
    const {_id} = req.authUser;

    // Check if company exist
    const company = await companyModel.findOne({companyName});

    // If not exist return error
    if(!company) return next(new Error('Company not found', {cause:404}));
    
    // Check if job exist
    const jobs = await jobModel.find({addedBy: company.companyHR});

    // If not exist return error
    if(!jobs.length) return next(new Error('No jobs found', {cause:404}));

    // Add jobs information to company object
    const companyObject = company.toObject();

    // Add jobs information to company object
    companyObject.jobsInformation = jobs;

    // Empty array to store co,ompany with job information
    let companyJobs = []
    
    // Push job object to jobsCompany array
    companyJobs.push(companyObject);

    // Return success response with the founded jobs with company information
    res.status(200).json({message: 'Company with job information found', jobs: companyJobs});


}

//================================= Get Jobs with filters  API =====================//
/**
 * destructuring user ID from req.authUser
 * destructuring data from req.body
 * create an empty filter object
 * if workingTime add it to filter object
 * if jobLocation add it to filter object
 * if seniorityLevel add it to filter object
 * if jobTitle add it to filter object
 * if techinicalSkills add it to filter object
 * find jobs with filter
 * if not found return error
 * return success response
 */
/**
 * Get jobs with filters API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the filtered founded jobs.
 * 
 * @throws {Error} If job not found, returns an error with status code 404.
 */
export const getJobsWithFiltersAPI = async (req, res, next) => {

    // Destructuring user ID from req.authUser
    const {_id} = req.authUser;
    
    // Destructuring data from req.body
    const {workingTime, jobLocation, seniorityLevel, jobTitle,techinicalSkills} = req.body;

    // Create an empty filter object
    let filterObjext = {};

    // If workingTime add it to filter object
    if(workingTime) filterObjext.workingTime = workingTime;
    
    // If jobLocation add it to filter object
    if(jobLocation) filterObjext.jobLocation = jobLocation;

    // If seniorityLevel add it to filter object
    if(seniorityLevel) filterObjext.seniorityLevel = seniorityLevel;

    // If jobTitle add it to filter object
    if(jobTitle) filterObjext.jobTitle = jobTitle;

    // If techinicalSkills add it to filter object
    if(techinicalSkills) filterObjext.techinicalSkills = { $in:techinicalSkills };

    // Find jobs with filter
    const filterJobs = await jobModel.find(filterObjext);

    // If not found return error
    if(!filterJobs.length) return next(new Error('No jobs found', {cause:404}));

    // Return success response with the filtered founded jobs
    res.status(200).json({message: 'Jobs found', jobs: filterJobs});
}

//================================= Apply for job  API =====================//
/**
 * destructuring user ID from req.authUser
 * destructuring data from req.body
 * check if job exist
 * if not exist return error
 * check if resume exist
 * if not exist return error
 * empty array to store resume data
 * generate random folder id
 * upload resume to cloudinary and get url
 * add application to database
 * if error while adding application, return error and delete resources from cloudinary
 * return success response
 */
/**
 * Apply for job API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the applied job.
 * 
 * @throws {Error} If job not found, returns an error with status code 404.
 * @throws {Error} If error while adding application, returns an error with status code 500.
 */
export const applyForJobAPI = async (req, res, next) => {

    // Destructuring user ID from req.authUser
    const {_id} = req.authUser;
    
    // Destructuring data from req.body 
    const {jobId, userTechSkills, userSoftSkills} = req.body;

    // Check if job exist
    const job = await jobModel.findById(jobId);

    // If not exist return error
    if(!job) return next(new Error('Job not found', {cause:404}));

    // Check if resume exist
    if (!req.file) return next(new Error('Please upload your resume', {cause:400}));

    // Empty array to store resume data
    let Pdf = [];

    // Generate random folder id
    const folderId = generateUniqueString(5);
    const file = req.file;

    // Upload resume to cloudinary and get url and public id
    const {secure_url, public_id} = await cloudinaryConnection().uploader.upload(file.path, {folder: `jobSearchApp/resume/${_id}/${folderId}`, use_filename: true, unique_filename: true})

    // Push resume data to array
    Pdf.push({secure_url, public_id,folderId});

    // Add application to database
    const application = await applicationModel.create({jobId, userTechSkills, userSoftSkills, userResume: Pdf, userId: _id});

    // If error while adding application, return error
    if(!application) {

        // Delete uploaded resume from cloudinary
        const deletedData = await cloudinaryConnection().api.delete_resources(public_id);

        // Delete folder in cloudinary
        return next(new Error('Error while adding application', {cause:500}));
    }

    // Return success response with the applied job
    res.status(201).json({message: 'Job applied successfully', application});
    
} 