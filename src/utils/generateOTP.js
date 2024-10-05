/**
 * Generates a random OTP of specified length
 * @param {number} limit - The length of the OTP to be generated. 
 * @returns {string} - The generated OTP.
 */
const generateOTP = (limit = 5) => {

    // Define the possible digits for the OTP
    const digits = '0123456789';

    // Initialize an empty string to store the OTP
    let OTP = '';

    // Generate the OTP by randomly selecting digits
    for (let i = 0; i < limit; i++) OTP += digits[Math.floor(Math.random() * 10)];

    // Return the generated OTP
    return OTP;
}

export default generateOTP;