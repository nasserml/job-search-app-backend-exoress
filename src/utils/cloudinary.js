// cloudinary connection
import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure and establish a connection to Cloudinary using the environment variables.
 * 
 * @function
 * @returns {cloudinary} Configured Cloudinary instance.
 * @throws {Error} If Cloudinary configuration fails due to missing environment variables.
 */
const cloudinaryConnection = () => {

    cloudinary.config({
        // Configure Cloudinary with the environment variables
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
    });

    // Return the configured Cloudinary instance
    return cloudinary;
}
// Export the configured Cloudinary connection function
export default cloudinaryConnection;


/**
 * Create a folder in Cloudinary using the Cloudinary API.
 * 
 * @async
 * @function
 * @param {string} folderName - The name of the foilder to be created in Cloudinary. 
 * @returns {Promise<Object>} A promise that resolves when the folder is created.
 * @throws {Error} If the folder creation fails.
 */
export const createFolderInCloudnary = async (folderName) => {
    try {
        // Create the folder using the Cloudinary API.
        const createdFolder = await cloudinaryConnection().api.create_folder(folderName);
    
        // Return the created folder object.
        return createdFolder;
    } catch (error) {
        // Log the error if folder creation fails.
        console.log('Create cloudinary folder error',error);

        // Throw an error if folder creation fails.
        throw new Error('Error creating folder in cloudinary');
    }
    
}

/**
 * Delete a folder and its content in Cloudinary using Cloudinary API.
 * 
 * @async
 * @function
 * @param {string} folderName - The name of the folder to deleted in Cloudinary. 
 * @returns {Promise} A promise that resolves when the folder is deleted.
 * @throws {Error} If the folder deletion fails.
 */
export const deleteFolderInCloudinary = async (folderName) => {
    try {
        // Delete all resources inside the folder
        const deletedFolderResourses = await cloudinaryConnection().api.delete_resources_by_prefix(`${folderName}/`, (result) => {
            console.log(result); 
          });

        // Delete the folder itself
        const deletedFolder = await cloudinaryConnection().api.delete_folder(folderName);
        return deletedFolder;
    } catch (error) {
        // Log the error if folder deletion fails.
        console.log('Delete cloudinary folder error',error);

        // Throw an error if folder deletion fails.
        throw new Error('Error deleting folder in cloudinary');
    }
}