import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/job.model.js";
import applicationModel from "../../../DB/models/application.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import exceljs from 'exceljs'
import moment from "moment";
import { createDocumnetByCreate, deleteDocumentByFindByIdAndDelete, findDocumentByFind, findDocumentByFindById, findDocumentByFindOne, updateDocumentByFinByIdAndUpdate } from "../../../DB/dbMethods.js";
import generateUniqueString from "../../utils/generateUniqueString.js";

//================================= AddCompany API =====================//
/***
 * destructuring user ID from req.authUser
 * destructuring data from req.body
 * create new company in the database
 * if any error occurs during job creation return error
 * return success response
 */
/**
 * Add new Company API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function. 
 * @returns {import('express').Response.json} - Returns success response with the new company.
 * 
 * @throws {Error} If any error occurs during job creation, returns an internal server error (HTTP status code 500).
 */
export const addCompanyAPI = async (req, res, next) => {
    
    // destructuring user ID from req.authUser
    const {_id} = req.authUser;

    // destructuring data from req.body
    const {companyName, description,industry , address, numberOfEmployees, companyEmail} = req.body;

    // create new company in the database
    const newCompany = await createDocumnetByCreate(companyModel, {companyName, description,industry , address, numberOfEmployees, companyEmail, companyHR:_id});

    // if any error occurs during job creation return error
    if(!newCompany.success) return next(new Error('Error while adding company', {cause:500}));

    // return success response
    res.status(newCompany.status).json({message: 'Company added successfully', newCompany: newCompany.isDocumentCreated});
}

//================================= UpdateCompany API =====================//
/***
 * destructuring company ID from req.params
 * destructuring user ID from req.authUser
 * destructuring data from req.body
 * check if company exist
 * if not exist return error
 * check if user is authorized
 * if not authorized return error
 * check if email exist
 * if not exist return error
 * check if company name exist
 * if not exist return error
 * update company
 * return success response
 */
/**
 * Uopdate Company API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function. 
 * @returns {import('express').Response.json} - Returns success response with the updated company.
 *  
 * @throws {Error} If company not found, returns an error with status code 404.
 * @throws {Error} If unauthorized access, returns an error with status code 401.
 * @throws {Error} If email already exists, returns an error with status code 400.
 * @throws {Error} If company name already exists, returns an error with status code 400.
 */
export const updateCompanyAPI = async (req, res, next) => {

    // destructuring company ID from req.params
    const {companyId} = req.params;

    // destructuring user ID from req.authUser
    const {_id} = req.authUser;
    
    // destructuring data from req.body
    const {companyName, description,industry , address, numberOfEmployees, companyEmail} = req.body;

    // check if company exist
    const isCompanyExist = await findDocumentByFindById(companyModel, companyId);

    // if not exist return error
    if(!isCompanyExist.success) return next(new Error('Company not found', {cause:404}));

    // check if user is authorized
    if(isCompanyExist.isDocumentExists.companyHR.toString() !== _id.toString()) return next(new Error('Unauthorized access', {cause:401}));

    // check if email exist
    const isEmailExist = await findDocumentByFindOne(companyModel, {companyEmail});

    // if not exist return error
    if(isEmailExist.success) return next(new Error('Email already exists', {cause:400}));

    // check if company name
    const isCompanyNameExist = await findDocumentByFindOne(companyModel, {companyName});

    // if not exist return error 
    if(isCompanyNameExist.success) return next(new Error('Company name already exists', {cause:400}));

    // check if company name has a value otherwise assign old value
    isCompanyExist.isDocumentExists.companyName = companyName || isCompanyExist.isDocumentExists.companyName;
    
    // check if  company description has a value otherwise assign old value
    isCompanyExist.isDocumentExists.description = description || isCompanyExist.isDocumentExists.description;
    
    // check if  company industry has a value otherwise assign old value
    isCompanyExist.isDocumentExists.industry = industry || isCompanyExist.isDocumentExists.industry;
    
    // check if  company address has a value otherwise assign old value
    isCompanyExist.isDocumentExists.address = address || isCompanyExist.isDocumentExists.address;
    
    // check if  company number of employees has a value otherwise assign old value
    isCompanyExist.isDocumentExists.numberOfEmployees = numberOfEmployees || isCompanyExist.isDocumentExists.numberOfEmployees;
    
    // check if  company email has a value otherwise assign old value
    isCompanyExist.isDocumentExists.companyEmail = companyEmail || isCompanyExist.isDocumentExists.companyEmail;

    // save updated company
    await isCompanyExist.isDocumentExists.save();

    // return success response
    res.status(isCompanyExist.status).json({message: 'Company updated successfully', updatedCompany: isCompanyExist.isDocumentExists});

}

//================================= DeleteCompany API =====================//
/***
 * destructuring company ID from req.params
 * destructuring user ID from req.authUser
 * check if company exist
 * if not exist return error
 * check if user is authorized
 * if not authorized return error
 * delete company
 * if any error occurs during company deletion return error
 * return success response
 */
/**
 * Delete Company API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function. 
 * @returns {import('express').Response.json} - Returns success response with the deleted company.
 * 
 * @throws {Error} If company not found, returns an error with status code 404.
 * @throws {Error} If unauthorized access, returns an error with status code 401.
 * @throws {Error} If an error occurs while deleting company, returns an error with status code 500.
 */
export const deleteCompanyAPI = async (req, res, next) => {

    // destructuring company ID from req.params
    const {companyId} = req.params;

    // destructuring user ID from req.authUser
    const {_id} = req.authUser;

    // check if company exist
    const isCompanyExist = await findDocumentByFindById(companyModel, companyId);

    // if not exist return error
    if(!isCompanyExist.success) return next(new Error('Company not found', {cause:404}));

    // check if user is authorized if not authorized return error
    if(isCompanyExist.isDocumentExists.companyHR.toString() !== _id.toString()) return next(new Error('Unauthorized access', {cause:401}));

    // delete company from database
    const deletedCompany = await deleteDocumentByFindByIdAndDelete(companyModel, companyId);

    // if any error occurs during company deletion return error
    if(!deletedCompany.success) return next(new Error('Error while deleting company', {cause:500}));

    // return success response with the deleted company
    res.status(deletedCompany.status).json({message: 'Company deleted successfully', deletedCompany: deletedCompany.isDocumentDeleted});
}

//================================= GetCompanyData API =====================//
/***
 * destructuring company ID from req.params
 * check if company exist
 * if not exist return error
 * get company jobs
 * if any error occurs during getting jobs return error
 * if no jobs found return error
 * if jobs found
 * return success response
 */
/**
 * Get Company Data API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the founded jobs with company information.
 *
 * @throws {Error} If company not found, returns an error with status code 404.
 * @throws {Error} If error while getting jobs, returns an error with status code 500.
 * @throws {Error} If no jobs found, returns an error with status code 404.
 */
export const getCompanyDataAPI = async (req, res, next) => {

    // destructuring company ID from req.params
    const {companyId} = req.params;
    
    // check if company exist
    const searchedCompany = await findDocumentByFindById(companyModel, companyId);

    // if not exist return error
    if(!searchedCompany.success) return next(new Error('Company not found', {cause:404}));
    
    // get company jobs
    const companyJobs = await findDocumentByFind(jobModel, {addedBy: searchedCompany.isDocumentExists.companyHR.toString()});

    // if any error occurs during getting jobs return error
    if(!companyJobs.success) return next(new Error('Error while getting jobs', {cause:500}));
    
    // if no jobs found return error
    if(!companyJobs.isDocumentExists.length) return next(new Error('No jobs found', {cause:404}));

    // return success response with the founded jobs with company information
    res.status(searchedCompany.status).json({message: 'Company found', searchedCompany: searchedCompany.isDocumentExists, companyJobs: companyJobs.isDocumentExists});
}

//================================= SearchCompanyByName API =====================//
/***
 * destructuring company name from req.query
 * search company by name
 * if company not found return error
 * if company found
 * return success response
 */
/**
 * Search Company Name API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the founded company.
 * 
 * @throws {Error} If company not found, returns an error with status code 404.
 */
export const searchCompanyByNameAPI = async (req, res, next) => {

    // destructuring company name from req.query
    const companyName = req.query.companyName;

    // search company by name
    const searchedCompany = await findDocumentByFindOne(companyModel, {companyName});

    // if company not found return error
    if(!searchedCompany.success) return next(new Error('Company not found', {cause:404}));

    // return success response with the founded company
    res.status(searchedCompany.status).json({message: 'Company found', searchedCompany: searchedCompany});
}

//================================= GetApplicationsForJobs API =====================//
/***
 * destructuring company name from req.params
 * destructuring user ID from req.authUser
 * check if company exist
 * if not exist return error
 * check if user is authorized
 * if not authorized return error
 * get applications for jobs
 * if any error occurs during getting jobs return error
 * if no jobs found return error
 * if jobs found
 * return success response
 */
/**
 * Get Applications for Jobs API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the founded applications with jobs information.
 * 
 * @throws {Error} If company not found, returns an error with status code 404.
 * @throws {Error} If unauthorized access, returns an error with status code 401.
 * @throws {Error} If error while getting jobs, returns an error with status code 500.
 * @throws {Error} If no jobs found, returns an error with status code 404.
 */
export const getApplicationsForJobsAPI = async (req, res, next) => {

    // destructuring company name from req.params
    const {companyName} = req.params;

    // destructuring user ID from req.authUser
    const {_id} = req.authUser;

    // check if company exist
    const searchedCompany = await findDocumentByFindOne(companyModel, {companyName});

    // if not exist return error
    if(!searchedCompany.success) return next(new Error('Company not found', {cause:404}));

    // check if user is authorized
    if(searchedCompany.isDocumentExists.companyHR.toString() !== _id.toString()) return next(new Error('Unauthorized access', {cause:401}));

    // get all jobs added by authenticated user
    const searchedJobs =  jobModel.find({addedBy: _id}).cursor();
    
    // empty array for storing applications with jobs
    let applicationsJobs = [];

    // iterate over the searched jobs
    for (let searchJob = await searchedJobs.next(); searchJob != null; searchJob = await searchedJobs.next() ){

        // get all applications for the searched job and populate user information
        const apllications = await applicationModel.find({jobId: searchJob._id}).populate('userId', '-password -createdAt -updatedAt -__v -recoveryEmail');

        // convert the searched job to object
        const searchJobObject = searchJob.toObject();

        // add applications to the searched job
        searchJobObject.applications = apllications;

        // push the searched job to the applicationsJobs array
        applicationsJobs.push(searchJobObject);
    }

    // if any error occurs during getting jobs return error
    if(!applicationsJobs.length) return next(new Error('No applications found', {cause:404}));
    
    // return success response with the founded applications with jobs information
    res.status(200).json({message: 'done', applicationsJobs});
}

//================================= GetAllApplicationsCompanyDay API =====================//
/***
 * destructuring company name and date from req.params
 * destructuring user ID from req.authUser
 * check if company exist
 * if not exist return error
 * check if user is authorized
 * if not authorized return error
 * get all jobs added by authenticated user
 * parse the date to moment format (yyyy-mm-dd)
 * add 1 day to the date indicating the end of the day
 * empty array for storing company applications on a specific day
 * iterate over the searched jobs
 * get all applications for the searched job and populate user information
 * convert the searched job to object
 * add applications to the searched job
 * push the searched job to the companyApplications array
 * check if companyApplications array is empty
 * if empty return error
 * create new excel workbook and add worksheet "Application"
 * add headers to worksheet
 * iterate over the companyApplications array
 * iterate through each application and add the data to the worksheet
 * create file path for the excel file
 * save the excel file to the file path
 * return success response
 */
/**
 * Get All Applications for Company on A Specific Day API endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {import('express').Response.json} - Returns success response with the excel file path.
 * 
 * @throws {Error} If company not found, returns an error with status code 404.
 * @throws {Error} If unauthorized access, returns an error with status code 401.
 * @throws {Error} If error while getting jobs, returns an error with status code 500.
 * @throws {Error} If no applications found, returns an error with status code 404.
 */
export const getAllApplicationsCompanyDayAPI = async (req, res, next) => {

    // destructuring company name and date from req.params
    const {companyName, date} = req.params;
    
    // destructuring user ID from req.authUser
    const {_id} = req.authUser;

    // check if company exist
    const searchedCompany = await findDocumentByFindOne(companyModel, {companyName});

    // if not exist return error
    if(!searchedCompany.success) return next(new Error('Company not found', {cause:404}));

    // check if user is authorized if not authorized return error
    if(searchedCompany.isDocumentExists.companyHR.toString() !== _id.toString()) return next(new Error('Unauthorized access', {cause:401}));

    // get all jobs added by authenticated user
    const searchedJobs =  jobModel.find({addedBy: _id}).cursor();

    // parse the date to moment format (yyyy-mm-dd)
    const dateMoment = moment(date).format('YYYY-MM-DD');

    // create a new date indicating the start of the day
    const startDate = new Date(dateMoment);

    // add 1 day to the date indicating the end of the day
    const endDate = moment(dateMoment).add(1, 'days').toDate();

    // empty array for storing company applications on a specific day
    let companyApplicationsDay = [];

    // iterate over the searched jobs 
    for (let searchJob = await searchedJobs.next(); searchJob != null; searchJob = await searchedJobs.next()){

        // get all applications for the searched job with start date and end date and populate user information
        const apllications = await applicationModel.find({jobId: searchJob._id, createdAt: {$gte: startDate, $lte: endDate}}).populate('userId', '-password -createdAt -updatedAt -__v -recoveryEmail');

        // convert the searched job to object
        const searchJobObject = searchJob.toObject();

        // add applications to the searched job
        searchJobObject.applications = apllications;

        // push the searched job to the companyApplications array
        companyApplicationsDay.push(searchJobObject);
    }

    // check if companyApplications array is empty if empty return error
    if(!companyApplicationsDay.length) return next(new Error('No applications found', {cause:404}));

    // create new excel workbook and add worksheet "Application"
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // add headers to worksheet 
    worksheet.addRow(['Job ID', "User ID", "Job Title", "Job Location", "Working Time", "Seniority Level", "Job Description", "Techinical Skills", "Soft Skills", "User First Name", "User Last Name", "User Name", "User Email","User Date Of Birth","User Phone", "User Status", "User Resume", "User Techinical Skills", "User Soft Skills"]);

    // iterate over the companyApplications array
    companyApplicationsDay.forEach((applicationJob) => {

        // destructuring data from applicationJob 
        const {_id ,jobTitle ,jobLocation, workingTime, seniorityLevel,  jobDescription, techinicalSkills, softSkills} = applicationJob;

        // iterate through each application and add the data to the worksheet
        const applications = applicationJob.applications.map(application => {

            // destructuring data from application
            const userId = application.userId._id.toString();
            const userFirstName = application.userId.firstName;

            const userLastName = application.userId.lastName;
            const userName = application.userId.username;

            const userEmail = application.userId.email;
            const userDateOfBirth = application.userId.DOB;

            const userPhone = application.userId.mobileNumber;
            const userStatus = application.userId.status;

            const userResumeSecureUrl = application.userResume[0].secure_url;
            const userTechinicalSkills = application.userTechSkills;

            const userSoftSkills = application.userSoftSkills;
            
            // add the data to the worksheet
            worksheet.addRow([_id.toString(), userId, jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, techinicalSkills.join(','), softSkills.join(','), userFirstName, userLastName, userName, userEmail, userDateOfBirth, userPhone, userStatus, userResumeSecureUrl, userTechinicalSkills.join(','), userSoftSkills.join(',')]);
        }) 
    });

    // save the workbook to a file path
    const excelFilePath = `./src/uploads/applications/applications_${companyName}_${date}.xlsx`;
    await workbook.xlsx.writeFile(excelFilePath);
    
    // return success response with excel file path
    res.status(200).json({message: 'Excel file created', excelFilePath});

}