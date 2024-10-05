import { Schema, model } from "mongoose";

/**
 * Mongoose schema for representing job applications in the system.
 *
 * @typedef {Object} applicationSchema
 * @property {Schema.Types.ObjectId} jobId - The ID of the job to which the application belongs.
 * @property {Schema.Types.ObjectId} userId - The ID of the user who submitted the application.
 * @property {string[]} userTechSkills - An array of technical skills of the applicant.
 * @property {string[]} userSoftSkills - An array of soft skills of the applicant.
 * @property {string} userResume - The URL or path to the uploaded resume of the applicant.
 * @property {Date} createdAt - The timestamp when the application document was created.
 * @property {Date} updatedAt - The timestamp when the application document was last updated.
 */
const applicationSchema = new Schema({
    jobId: {type: Schema.Types.ObjectId, ref: 'Job'},
    userId: {type: Schema.Types.ObjectId, ref:'User'},
    userTechSkills: [String],
    userSoftSkills: [String],
    userResume:[]
},{timestamps: true})

/**
 * Mongoose model for job applications.
 *
 * @type {model<applicationSchema>}
 */
const applicationModel = model('Application', applicationSchema);

export default applicationModel