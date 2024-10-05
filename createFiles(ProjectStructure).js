
import fs from "fs/promises";
import path from "path";

// List of entities
const entities = ['user', 'company', 'job', 'application'];

// List of common files
const list_of_files = [
    "config/dev.config.env",
    "DB/connection.js",
    "DB/dbMethods.js",
    "src/middlewares/auth.middleware.js",
    "src/middlewares/validation.middleware.js",
    "src/middlewares/multer.middleware.js",
    "src/middlewares/globalResponse.middleware.js",
    "src/utils/cloudinary.js",
    "src/utils/allowedExtensions.js",
    "src/utils/pagination.js",
    "src/utils/generalUniqueString.js",
    "src/utils/systemRoles.js",
    "src/utils/general.validation.rule.js",
    "src/utils/generateOTP.js",
    "src/uploads/applications/test.js",
    "index.js"
];

/**
 * Capitalizes the first letter of a string and convers the rest of the string to lowercase.
 * 
 * @param {string} str - The input string to be capitalized. 
 * @returns {string} - A new string with the first letter capitalized and the rest in lowercase.
 */
const capitalizeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase(); 



/**
 * Generates and adds file paths for common files related to each entity in the list.
 * 
 * @param {string[]} entities - An array of entity names for which files will be generated.
 * @returns {void} This function modifies the global list_of_files array.
 * 
 * @description
 * This function takes an array of entity names and generates file paths for common files.
 * assosciated with each entity, such as model, controllerm routes, and validation sdchema files.
 * The generated file paths are added to the global list_of_files array.
 * 
 * Example usage:
 * ```javascript
 * const entities = ['user', 'company', 'job', 'application'];
 * getListOfFiles(entities);
 * console.log(list_of_files);
 * ```
 */
const getListOfFiles = (entities) => {
    entities.map((entityName) => {
        let modelEntity = `DB/models/${entityName}.model.js`;
        let controllerEntity = `src/modules/${capitalizeFirstLetter(entityName)}/${entityName}.controller.js`;
        let endPointsRolesEntity = `src/modules/${capitalizeFirstLetter(entityName)}/${entityName}.endpoints.roles.js`;
        let routesEntity = `src/modules/${capitalizeFirstLetter(entityName)}/${entityName}.routes.js`;
        let validationSchemasEntity = `src/modules/${capitalizeFirstLetter(entityName)}/${entityName}.validationSchemas.js`;
        
        list_of_files.push(modelEntity,endPointsRolesEntity,controllerEntity,routesEntity,validationSchemasEntity);
    });
    
}

getListOfFiles(entities);

/**
 * Asynchronouslycreates a file at the specified filepath, including any necessary directories.
 * 
 * @param {string} filepath - The path of the file to be created.
 * @return {Promise<void>} A promise that resolves when the file is created. 
 * 
 * @description
 * This function takes a filepath, extracts the directory and filename from it, end ensure that
 * the directory exists. If the directory does not exist, it is created recursively. The function then
 * checks if the file already exists. If it does, amessage is logged. If the file does not exist.
 * an empty file is created, and a message is logged. The function returns a promise that resolves
 * when the file is successfully created.
 * 
 * Example usage:
 * ```javascript
 * const filepath = "src/modules/User/user.controller.js";
 * createFile(filepath).then(() => console.log("File created successfully"));
 */
const createFile = async (filepath) => {
    // Extract the directory and filename from the filepath
    const filedir = path.dirname(filepath);
    const filename = path.basename(filepath);

    // Create the directory if it does not exist
    if (filedir !== "") {
        await fs.mkdir(filedir, { recursive: true });
        console.log(`Creating directory: ${filedir} for the file ${filename}`);
    }

    // Construct the full file path
    const filePath = path.join(process.cwd(), filepath);

    try {
        // Check if the file exists
        await fs.access(filePath);  
        console.log(`${filename} is already created`);
    } catch (err) {
        // Create an empty file if it does not exist
        await fs.writeFile(filePath, '');
        console.log(`Creating empty file: ${filename}`);
    }
};

// Call the createFile function for each file in the list
Promise.all(list_of_files.map(createFile))
    .then(() => console.log("All files and directories created successfully"))
    .catch((error) => console.error("Error:", error));
