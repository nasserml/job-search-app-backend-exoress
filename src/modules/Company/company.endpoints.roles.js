import { systemRoles } from "../../utils/systemRoles.js"


export const endPointsRoles = {
    ADD_COMPANY: [systemRoles.COMPANY_HR],
    UPDATE_COMPANY: [systemRoles.COMPANY_HR],
    DELETE_COMPANY: [systemRoles.COMPANY_HR],
    GET_COMPANY_DATA: [systemRoles.COMPANY_HR],
    SEARCH_COMPANY_BY_NAME: [systemRoles.COMPANY_HR, systemRoles.USER],
    GET_APPLICATION_JOBS: [systemRoles.COMPANY_HR],
    GET_APPLICATIONS_COMPANY_NAME: [systemRoles.COMPANY_HR]
}