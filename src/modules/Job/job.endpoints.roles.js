import { systemRoles } from "../../utils/systemRoles.js";


export const endPointsRoles = {
    ADD_JOB: [systemRoles.COMPANY_HR],
    UPDATE_JOB: [systemRoles.COMPANY_HR],
    DELETE_JOB: [systemRoles.COMPANY_HR],
    GET_ALL_JOBS_COMPANY: [systemRoles.USER,systemRoles.COMPANY_HR],
    GET_ALL_JOBS_SPECIFIC_COMPANY: [systemRoles.USER, systemRoles.COMPANY_HR],
    GET_JOBS_FILTER: [systemRoles.USER, systemRoles.COMPANY_HR],
    APPLY_JOB: [systemRoles.USER]
}