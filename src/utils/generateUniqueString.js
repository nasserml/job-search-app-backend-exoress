import { customAlphabet } from 'nanoid'
/**
 * Generate a unique string using the customAlphabet function from nanoid library.
 * 
 * @function
 * @param {number} [length=13] - The length of the unique string to be generated.
 * @returns {string} - The generated unique string.
 * @throws {Error} If an error occurs while generating the unique string.
 */
const generateUniqueString = (length) => {
    try {
        // Generate the unique string using the customAlphabet function from nanoid library with specified characters and length.
        const nanoid = customAlphabet('12345asdfgh', length || 13);
        return nanoid();
    } catch (error) {
        // Log the error if string generation fails.
        console.log('Error in uniqueString nanoid', error);

        // Throw an error if string generation fails.
        throw new Error('Error in generating unique string.');
    }    
}

// Export the function for external use.
export default generateUniqueString