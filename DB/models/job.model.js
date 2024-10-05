import { Schema, model } from "mongoose";

/**
 * Mongoose schema definition for the Job model.
 *
 * @typedef {Object} JobSchema
 * @property {String} jobTitle - The title of the job. (Required)
 * @property {String} jobLocation - The location of the job, can be 'onsite', 'remotely', or 'hybrid'. (Required)
 * @property {String} workingTime - The working time for the job, can be 'part-time' or 'full-time'. (Required)
 * @property {String} seniorityLevel - The seniority level for the job, such as 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', or 'CTO'. (Required)
 * @property {String} jobDescription - A detailed description of the job. (Required)
 * @property {Array<String>} technicalSkills - An array of technical skills required for the job.
 * @property {Array<String>} softSkills - An array of soft skills required for the job.
 * @property {Schema.Types.ObjectId} addedBy - The MongoDB ObjectId reference to the User model who added the job. (Reference)
 * @property {Date} createdAt - The timestamp indicating when the document was created.
 * @property {Date} updatedAt - The timestamp indicating when the document was last updated.
 */

const jobSchema = new Schema({
    jobTitle: {type: String, required: true},
    jobLocation: {type: String, enum: ['onsite', 'remotely', 'hybrid'], required: true},
    workingTime: {type: String, enum: ['part-time', 'full-time'], required:true},
    seniorityLevel: {type: String, enum:['Junior', 'Mid-Level', 'Senior','Team-Lead', 'CTO'], required: true},
    jobDescription: {type: String, required: true},
    techinicalSkills: [String],
    softSkills: [String],
    addedBy: {type: Schema.Types.ObjectId, ref: 'User'}

}, {timestamps: true});

/**
 * Mongoose model for the Job schema.
 *
 * @typedef {model<jobSchema>} jobModel
 */
const jobModel = model('Job', jobSchema);

export default jobModel;