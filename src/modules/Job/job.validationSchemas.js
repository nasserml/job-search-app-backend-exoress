import Joi from "joi";
import { systemRoles } from "../../utils/systemRoles.js";
import moment from "moment";


export const addJobSchema = {
    body : Joi.object({
        jobTitle: Joi.string().required().messages({'any.required':'Please enter job title'}),
        jobLocation: Joi.string().valid('onsite','remotely', 'hybrid').required().messages({'any.required':'Please enter job location'}),
        workingTime: Joi.string().valid('part-time','full-time').required().messages({'any.required':'Please enter working time'}),
        seniorityLevel: Joi.string().valid('Junior','Mid-Level','Senior','Team-Lead',  'CTO').required().messages({'any.required':'Please enter seniority level'}),
        jobDescription: Joi.string().required().messages({'any.required':'Please enter job description'}),
        techinicalSkills: Joi.array().required().messages({'any.required':'Please enter techinical skills'}),
        softSkills: Joi.array().required().messages({'any.required':'Please enter soft skills'})
    })
};

export const updateJobSchema  = {
    params: Joi.object({
        jobId: Joi.string().required().messages({'any.required':'Please enter job id'}),
    }),
    body: Joi.object({
        jobTitle: Joi.string().required().messages({'any.required':'Please enter job title'}),
        jobLocation: Joi.string().valid('onsite','remotely', 'hybrid').required().messages({'any.required':'Please enter job location'}),
        workingTime: Joi.string().valid('part-time','full-time').required().messages({'any.required':'Please enter working time'}),
        seniorityLevel: Joi.string().valid('Junior','Mid-Level','Senior','Team-Lead',  'CTO').required().messages({'any.required':'Please enter seniority level'}),
        jobDescription: Joi.string().required().messages({'any.required':'Please enter job description'}),
        techinicalSkills: Joi.array().required().messages({'any.required':'Please enter techinical skills'}),
        softSkills: Joi.array().required().messages({'any.required':'Please enter soft skills'})

    })
};

export const deleteJobSchema = {
    params: Joi.object({
        jobId:Joi.string().required().messages({'any.required':'Please enter job id'}),
    })
};

export const getAllJobsSpecificCompanySchema = {
    query : Joi.object({
        companyName: Joi.string().required().messages({'any.required': 'Please enter your company name'})
    })
};

export const getJobsFilterSchema = {
    body: Joi.object({
        seniorityLevel: Joi.string().valid('Junior','Mid-Level','Senior','Team-Lead',  'CTO'),
        jobDescription: Joi.string(),
        techinicalSkills: Joi.array(),
        jobTitle: Joi.string(),
        softSkills: Joi.array()
    }).or('seniorityLevel', 'jobDescription', 'technicalSkills', 'softSkills', 'jobTitle')
};


export const applyJobSchema = {
    body:{
        jobId: Joi.string().required().messages({'any.required':'Please enter job id'}),
        userTechSkills:Joi.array().required().messages({'any.required':'Please enter techinical skills'}),
        userSoftSkills: Joi.array().required().messages({'any.required':'Please enter soft skills'})
    }
};
