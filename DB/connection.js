import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * 
 * @function
 * @async
 * @returns {Promise<void>} - A promise that resolves once the connection is established.
 * 
 * @description
 * This function connects to the MongoDB database using connection URL specified in the
 * environment variable `CONNECTION_URL_LOCAL`. It uses Mongoose to handle the connection.
 * 
 * The function logs a success message to the console when the connection is successful,
 * and an error message is logged if the connection fails.
 */
const db_connection = async () => {
    await mongoose.connect(process.env.CONNECTION_URL_LOCAL)
    .then((res) => console.log('db connected successfully'))
    .catch((err) => console.log('db connection failed', err));
}

export default db_connection;