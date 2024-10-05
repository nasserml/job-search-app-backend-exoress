
/**
 * Find documents by using the 'find' method of a Mongoose model.
 * 
 * @param {mongoose.Model} model - The Mongoose model to search.
 * @param {Object} query - The query object to filter the documents. 
 * @returns {Object} - An object containing the result of the search. 
 *                   - If the search is successful, the object will have the properties:
 *                       - message: 'document found'
 *                       - isDocumentExists: The found documents
 *                       - status: 200
 *                       - success: true
 *                   - If the search is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the search is unsuccessful because no document is found, the object will have the properties:
 *                       - message: 'document not found'
 *                       - status: 404
 *                       - success: false
 */
export const findDocumentByFind = async (model, query) => {
    // Check for invalid arguments
    if (!model || !query) return { message: 'Invalid arguments', status:400, success: false}

    // Find documents using the query
    const isDocumentExists = await model.find(query);

    // If no document is found, return appropriate response
    if(!isDocumentExists) return {message: 'document not found', status: 404, success: false}

    // Return successful response with the found document
    return {message: 'documents found', isDocumentExists,status:200, success: true};
};


/**
 * Find a documentt using the 'findOne' method of a mongoose model.
 * 
 * @param {mongoose.Model} model - The mongoose model to search in.
 * @param {Object} query - The query object to search for. 
 * @returns {Object} - An object containing the result of the search. 
 *                   - If the search is successful, the object will have the properties:
 *                       - message: 'document found'
 *                       - isDocumentExists: The found document
 *                       - status: 200
 *                       - success: true
 *                   - If the search is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the search is unsuccessful because no document is found, the object will have the properties:
 *                       - message: 'document not found'
 *                       - status: 404
 *                       - success: false
 */
export const findDocumentByFindOne = async (model, query) => {
    // Check for invalid arguments
    if (!model || !query) return { message: 'Invalid arguments', status:400, success: false}

    // Find a document using the query
    const isDocumentExists = await model.findOne(query);

    // If no document is found, return appropriate response
    if(!isDocumentExists) return {message: 'document not found', status: 404, success: false}

    // Return successful response with the found document
    return {message: 'document found', isDocumentExists,status:200, success: true};
};



/**
 * Finds a document by its ID using 'findById' method in mongoose.
 * 
 * @param {mongoose.Model} model - The mongoose model to search in. 
 * @param {string} idToBeFound - The ID of the document to find.
 * @param {string[]} selectedKeys - Optional. The keys to select from the document
 * @returns {onject} - An object containing the result of the operation. 
 *                   - If the search is successful, the object will have the properties:
 *                       - message: 'document found'
 *                       - isDocumentExists: The found document
 *                       - status: 200
 *                       - success: true
 *                   - If the search is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the search is unsuccessful because no document is found, the object will have the properties:
 *                       - message: 'document not found'
 *                       - status: 404
 *                       - success: false
 * 
 */
export const findDocumentByFindById = async (model, idToBeFound, selectedKeys) => {
    // Check for invalid aguments
    if (!model || !idToBeFound) return { message: 'Invalid arguments', status:400, success: false}

    
    // Find the document by ID
    const isDocumentExists = await model.findById(idToBeFound,selectedKeys);
    

    // If no document is found, return appropriate response
    if(!isDocumentExists) return {message: 'document not found', status: 404, success: false}

    // Return successful response with the found document
    return {message: 'document found', isDocumentExists,status:200, success: true};
};


/**
 * Finds a document in the database using the 'find' and 'sort' methods of Mongoose. 
 * 
 * @param {mongoose.Model} model - The Mongoose Model to search.
 * @param {Object} query - The query object to filter the search
 * @param {Object} sortQuery - The sort query object to sort the results.
 * @returns {Object} - An object with information about the search result.
 *                   - If the search is successful, the object will have the properties:
 *                       - message: 'document found'
 *                       - isDocumentExists: The found document
 *                       - status: 200
 *                       - success: true
 *                   - If the search is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the search is unsuccessful because no document is found, the object will have the properties:
 *                       - message: 'document not found'
 *                       - status: 404
 *                       - success: false
 */
export const findDocumentByFindAndSort = async (model, query, sortQuery) => {

    // Check for invalid aguments
    if (!model || !query || !sortQuery) return { message: 'Invalid arguments', status:400, success: false}

    // Find the documents using the 'find' and 'sort' methods
    const isDocumentExists = await model.find(query).sort(sortQuery);

    // If no document is found, return appropriate response
    if(!isDocumentExists) return {message: 'document not found', status: 404, success: false}

    // Return successful response with the found document
    return {message: 'document found', isDocumentExists,status:200, success: true};
};


/**
 * Creates a documen using the 'create' method of a mongoose model.
 * 
 * @param {mongoose.Model} model - The mongoose model to create the document with.
 * @param {Object} data - The data to create the document with.
 * @returns {object} - An object containing the result of the document creation.
 *                   - If the creation is successful, the object will have the properties:
 *                       - message: 'document created success'
 *                       - createDocument: The created document
 *                       - status: 201
 *                       - success: true
 *                   - If the creation is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the creation is unsuccessful because no document is created, the object will have the properties:
 *                       - message: 'document not created'
 *                       - status: 404
 *                       - success: false
 */
export const createDocumnetByCreate = async(model, data) => {
    
    // Check for invalid aguments
    if (!model || !data) return { message: 'Invalid arguments', status:400, success: false}

    // Create the document using the 'create' method
    const createDocument = await model.create(data);

    // If no document is created, return appropriate response
    if(!createDocument) return {message: 'document not created', status:500, success:false}

    // Return successful response with the created document
    return {message: 'document created success', createDocument, success: true, status: 201};
}


/**
 * Update the documemnnt using the 'updateOne' method of a Mongoose model.
 * 
 * @param {mongoose.Model} model - The Mongoose model to update the document in.
 * @param {Object} query - The query to find the document to update.
 * @param {Object} updatedData - The data to update the document with.
 * @returns {Object} - An Object containing the status and result of the uodate operation.
 *                   - If the update is successful, the object will have the properties:
 *                       - message: 'document updated success'
 *                       - updateDocument: The updated document
 *                       - status: 201
 *                       - success: true
 *                   - If the update is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the update is unsuccessful because no document is updated, the object will have the properties:
 *                       - message: 'document not updated'
 *                       - status: 404
 *                       - success: false
 */
export const updateDocumentByUpdateOne = async(model, query, updatedData) => {

    // Check for invalid aguments
    if (!model || !updatedData || !query) return { message: 'Invalid arguments', status:400, success: false}

    // Update the document using the 'updateOne' method
    const updateDocument = await model.updateOne(query, updatedData);

    // If no document is updated, return appropriate response
    if(!updateDocument.modifiedCount) return {message: 'document not updated', status:400, success:false}
    
    // Return successful response with the updated document
    return {message: 'document updated success', updateDocument, success: true, status: 201};
};


/**
 * Update the document using 'findOneAndUpdate' method of a Mongoose Model.
 * 
 * @param {mongoose.Model} model - The Mongoose Model to update the document in. 
 * @param {object} query - The query to find the document to update. 
 * @param {Object} updatedData - The updated data to be applied to the document.
 * @param {Object} options - The additional options for the findOneAndUpdate method.
 * @returns {object} - An object containing the status and result of the update operation.
 *                   - If the update is successful, the object will have the properties:
 *                       - message: 'document updated success'
 *                       - updateDocument: The updated document
 *                       - status: 201
 *                       - success: true
 *                   - If the update is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the update is unsuccessful because no document is updated, the object will have the properties:
 *                       - message: 'document not updated'
 *                       - status: 404
 *                       - success: false
 */
export const updateDocumentByFindOneAndUpdate = async (model, query, updatedData, options) => {

    // Check for invalid aguments
    if (!model || !updatedData || !query) return { message: 'Invalid arguments', status:400, success: false}

    // Update the document using the 'findOneAndUpdate' method
    const updateDocument = await model.findOneAndUpdate(query, updatedData, options);

    // If no document is updated, return appropriate response
    if(!updateDocument) return {message: 'document not updated', status:400, success:false}
    
    // Return successful response with the updated document
    return {message: 'document updated success', updateDocument, success: true, status: 201};

};

/**
 * Update the document using 'findByIdAndUpdate' method of a Mongoose Model.
 * @param {mongoose.Model} model - The Mongoose Model to update the document in.
 * @param {string} idToBeUpdated - The ID of the document to be updated.
 * @param {Object} updatedData - The updated data to be applied to the document. 
 * @param {Object} options - The additional options for the findByIdAndUpdate method.
 * @returns {object} - An object containing the status and result of the update operation.
 *                   - If the update is successful, the object will have the properties:
 *                       - message: 'document updated success'
 *                       - updateDocument: The updated document
 *                       - status: 201
 *                       - success: true
 *                   - If the update is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the update is unsuccessful because no document is updated, the object will have the properties:
 *                       - message: 'document not updated'
 *                       - status: 404
 *                       - success: false
 */
export const updateDocumentByFinByIdAndUpdate = async (model, idToBeUpdated, updatedData, options) => {

    // Check for invalid aguments
    if (!model || !updatedData || !idToBeUpdated) return { message: 'Invalid arguments', status:400, success: false}

    // Update the document using the 'findByIdAndUpdate' method
    const updateDocument = await model.findByIdAndUpdate(idToBeUpdated,updatedData, options);

    // If no document is updated, return appropriate response
    if(!updateDocument) return {message: 'document not updated', status:400, success:false}

    // Return successful response with the updated document
    return {message: 'document updated success', updateDocument, success: true, status: 201};
};

/**
 * Deletes a document from the database using 'findByIdAndDelete' method of a Mongoose Model.
 * 
 * @param {mongoose.Model} model - The Mongoose model to perform the deletion on. 
 * @param {string} idToBeDeleted - The ID of the document to be deleted.
 * @returns {object} - An object containing the deletion status and message.
 *                   - If the deletion is successful, the object will have the properties:
 *                       - message: 'document deleted success'
 *                       - deleteDocument: The deleted document
 *                       - status: 201
 *                       - success: true
 *                   - If the deletion is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the deletion is unsuccessful because no document is deleted, the object will have the properties:
 *                       - message: 'document not deleted'
 *                       - status: 404
 *                       - success: false
 */
export const deleteDocumentByFindByIdAndDelete = async(model, idToBeDeleted) => {

    // Check for invalid aguments
    if (!model || !idToBeDeleted) return { message: 'Invalid arguments', status:400, success: false}

    // Delete the document using the 'findByIdAndDelete' method
    const deleteDocument = await model.findByIdAndDelete(idToBeDeleted);

    // If no document is deleted, return appropriate response
    if(!deleteDocument) return {message: 'document not deleted', status:404, success:false}
    
    // Return successful response with the deleted document
    return {message: 'document deleted success', deleteDocument, success: true, status: 201};

};


/**
 * Deletes a document from the database using 'findOneAndDelete' method of a Mongoose Model.
 * 
 * @param {mongoose.Model} model - The Mongoose Model to perform the deletion on.
 * @param {Object} query - The query object to find the document to delete. 
 * @returns {object} - An object containing the deletion status and message.
 *                   - If the deletion is successful, the object will have the properties:
 *                       - message: 'document deleted success'
 *                       - deleteDocument: The deleted document
 *                       - status: 201
 *                       - success: true
 *                   - If the deletion is unsuccessful due to invalid arguments, the object will have the properties:
 *                       - message: 'invalid arguments'
 *                       - status: 400
 *                       - success: false
 *                   - If the deletion is unsuccessful because no document is deleted, the object will have the properties:
 *                       - message: 'document not deleted'
 *                       - status: 404
 *                       - success: false
 */
export const deleteDocumentByFindOneAndDelete = async (model, query) => {

    // Check for invalid aguments
    if (!model || !query) return { message: 'Invalid arguments', status:400, success: false}

    // Delete the document using the 'findOneAndDelete' method
    const isDeletedDocumentExists = await model.findOneAndDelete(query);

    // If no document is deleted, return appropriate response
    if(!isDeletedDocumentExists) return {message: 'document not deleted', status: 404, success: false}

    // Return successful response
    return {message: 'document deleted succes', isDeletedDocumentExists,status:200, success: true};
}

