import { systemRoles } from "../../utils/systemRoles.js"

/**
 * Predefined endpoints roles used in user endpoints.
 * 
 * @constant
 * @type {Object}
 * @property {Array<string>} UPDDATE - Roles allowed to access the update endpoint.
 *  - [systemRoles.USER, systemRoles.COMPANY_HR]: Users with the roles 'User' and 'Company_HR' are allowd to access the update endpoint.
 * @property {Array<string>} DELETE - Roles allowed to access the delete endpoint.
 *  - [systemRoles.USER, systemRoles.COMPANY_HR]: Users with the roles 'User' and 'Company_HR' are allowd to access the delete endpoint.
 * @property {Array<string>} USER_DATA - Roles allowed to access the user data endpoint.
 *  - [systemRoles.USER, systemRoles.COMPANY_HR]: Users with the roles 'User' and 'Company_HR' are allowd to access the user data endpoint.
 * @property {Array<string>} UPDATE_PASSWORD - Roles allowed to access the update password endpoint.
 *  - [systemRoles.USER, systemRoles.COMPANY_HR]: Users with the roles 'User' and 'Company_HR' are allowd to access the update password endpoint.
 * @property {Array<string>} GET_ACCOUNTS_WITH_RECOVERY_EMAIL - Roles allowed to access the get accounts with recovery email endpoint.
 *  - [systemRoles.COMPANY_HR]: Users with the role 'Company_HR' are allowd to access the get accounts with recovery email endpoint.
 */
export const endPointsRoles = {
    UPDDATE: [systemRoles.USER, systemRoles.COMPANY_HR],
    DELETE: [systemRoles.USER, systemRoles.COMPANY_HR],
    USER_DATA: [systemRoles.USER, systemRoles.COMPANY_HR],
    UPDATE_PASSWORD: [systemRoles.USER, systemRoles.COMPANY_HR],
    GET_ACCOUNTS_WITH_RECOVERY_EMAIL: [systemRoles.COMPANY_HR]
}