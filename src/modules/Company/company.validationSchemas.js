import Joi from 'joi';
import { systemRoles } from '../../utils/systemRoles.js';
import moment from 'moment';

const validateDateFormat = (value, helpers) => {
    const isValidDate = moment(value, 'YYYY-MM-DD', true).isValid();

    if (isValidDate) {
        return value;
    } else {
        return helpers.message('Invalid date format. Use yyyy-mm-dd.');
    }
};

export const addCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().required().messages({'any.required': 'Please enter your company name'}),
        description: Joi.string().required().messages({'any.required': 'Please enter your company description'}),
        industry: Joi.string().required().messages({'any.required': 'Please enter your company industry'}),
        address: Joi.string().required().messages({'any.required': 'Please enter your company address'}),
        numberOfEmployees: Joi.string().regex(/^\d+-\d+$/).required().messages({'any.required': 'Please enter your company number of employees should be like 1-10'}),
        companyEmail: Joi.string().email().required().messages({'any.required': 'Please enter your company email'}),
        companyHR: Joi.string().required().messages({'any.required': 'Please enter your company HR'})
    })
}

export const updateCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().messages({'any.required': 'Please enter your company name'}),
        description: Joi.string().messages({'any.required': 'Please enter your company description'}),
        industry: Joi.string().messages({'any.required': 'Please enter your company industry'}),
        address: Joi.string().messages({'any.required': 'Please enter your company address'}),
        numberOfEmployees: Joi.string().regex(/^\d+-\d+$/).messages({'any.required': 'Please enter your company number of employees should be like 1-10'}),
        companyEmail: Joi.string().email().messages({'any.required': 'Please enter your company email'}),
    }).or('companyName', 'description', 'industry', 'address', 'numberOfEmployees', 'companyEmail') // at least one field is required
}

export const deleteCompanySchema = {
    params: Joi.object({
        companyId: Joi.string().required().messages({'any.required': 'Please enter your company id'})
    })
}


export const getCompanyDataSchema = {
    params: Joi.object({
        companyId: Joi.string().required().messages({'any.required': 'Please enter your company id'})
    })
}

export const searchCompanyNameSchema = {
    query: Joi.object({
        companyName: Joi.string().required().messages({'any.required': 'Please enter your company name'})
    })
}

export const getApplicationJobsSchema = {
    params: Joi.object({
        companyName: Joi.string().required().messages({'any.required': 'Please enter your company name'}),
    })
}

export const getApplicationsCompanyDaySchema = {
    params: Joi.object({
        companyName: Joi.string().required().messages({'any.required': 'Please enter your company name'}),
        date:Joi.string().custom(validateDateFormat).required().messages({'any.required': 'Please enter your date'})
    })
}