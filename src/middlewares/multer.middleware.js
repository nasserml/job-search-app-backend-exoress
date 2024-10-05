

import multer from "multer"
import generateUniqueString from "../utils/generateUniqueString.js";
import { allowedExtensions } from "../utils/allowedExtensions.js";

import fs from 'fs' // built in module for handling file system
import path from 'path' // built in module for handling path


/**
 * 
 * check the path if not exist create it
 * store in diskStorage
 * filter the file
 * create multer instance
 * return multer instance
 */
/**
 * Create and configure a Multer middleware for handling local file uploads.
 * Returns a multer instance configured for local storage.
 * The multer instance will create a destination path on disk if it doesn't exist,
 * and store uploaded files in that path.
 * The files will be filtered based on the allowed extensions.
 * 
 * @function
 * @param {Object} options - Configuration options for Multer middleware.
 * @param {Array<String>} options.extensions - Allowed file extensions (default: allowedExtensions.image).
 * @param {string} options.filePath -Relative path to store uploaded filed (default: 'general').
 * @returns {Object} Configured Multer middleware instance.
 */
export const multerMiddleLocal = (options) => {
    
    // Destructure options or use default values
    const {extensions = allowedExtensions.image, filePath = 'general'} = options;

    // Calculate the destination path
    const destinationPath = path.resolve(`src/uploads/${filePath}`);
    
    // Create the destination path if it does not exist
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }


    /**
     * Multer storage configuration for file uploads.
     * 
     * @constant
     * @type {Object}
     * @property {Function} destination - Afunction defining the destination folder for uploaded files.
     * @property {Function} filename - A function defining the filename for uploaded files.
     */
    const storage = multer.diskStorage({
        /**
         * Set the destination path for the uploaded file.
         * 
         * @param {Request} req - The request object.
         * @param {File} file - The file object.
         * @param {Function} cb - The callback function.
         */
        destination: function (req, file, cb) {
            // Callback function to specify the destination folder
            cb(null, destinationPath);
        },
        /**
         * Generates a unique filename by concatenating a randomly generated string with the original filename.
         * @param {Request} req - The request object.
         * @param {File} file - The file object.
         * @param {Function} cb - The callback function.
         */
        filename: (req, file, cb) => {

            // Generate a unique filename
            const uniqueFileName = generateUniqueString(6) + '_' + file.originalname;

            // Callback function to specify the filename
            cb(null, uniqueFileName);
        }
    });

    /**
     * Multer file filter function to restrict file uploads based on allowed extensions.
     * 
     * @function
     * @param {import('express').Request} req - Express request object. 
     * @param {File} file - Uploaded file information.
     * @param {Function} cb - Callback function to indicate if the file is allowed or not.
     * 
     */
    const fileFilter = (req, file, cb) => {
        // Check if the file extension is allowed
        if (extensions.includes(file.mimetype.split('/')[1])) {
            // If the file type is allowed, pass no error and set to true
            return cb(null, true);
        }

        // If the file format is not allowed, pass an error and set to false
        cb(new Error('Image format is not allowed!'), false);
    }

    /**
     * Multer middleware configured with the defined file filter and storage options.
     * 
     * @constant
     * @type {Object}
     */
    const file = multer({ fileFilter, storage })
    
    // Export the configured multer instance for file uploads
    return file
}



/**
 * Create and configure a Multer middleware for handling file uploads with original filenames on the host.
 * 
 * @function
 * @param {Object} options - Configuration options for Multer middleware.
 * @param {string[]} options.extensions - Allowed file extensions (default: allowedExtensions.image).
 * @returns {Object} Configured Multer middleware instance.
 */
export const multerMiddleHost = ({
    extensions = allowedExtensions.image,
}) => {

    /**
     * Multer storage configuration for handling uploaded files with original filenames.
     * 
     * @constant
     * @type {Object}
     * @property {Function} filename - Callback function for setting the filename of an uploaded file.
     */
    const storage = multer.diskStorage({

        /**
         * Callback function for setting the filename of an uploaded file.
         * 
         * @param {Object} req - The request object. 
         * @param {Object} file - The uploaded file object.
         * @param {Function} cb - The callback function.
         */
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })

   
    /**
     * Multer file filter function to restrict file uploads based on allowed extensions.
     * 
     * @function
     * @param {import('express').Request} req - Express request object. 
     * @param {File} file - Uploaded file information.
     * @param {Function} cb - Callback function to indicate if the file is allowed or not.
     * 
     */
    const fileFilter = (req, file, cb) => {

        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true);
        }
        cb(new Error('Image format is not allowed!'), false);
    }

    /**
     * Multer middleware configured with the defined file filter and storage options.
     * 
     * @constant
     * @type {Object}
     */
    const file = multer({ fileFilter, storage });

    // Export the configured Multer instance for file uploads
    return file;
}