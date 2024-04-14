/**
 * @class RuntimeError 
 * @description Represents a custom error specifically designed for runtime issues within the SmartTrash Cloud environment.
 * @extends Error
*/
class RuntimeError extends Error{
    /**
     * @constructor
     * @param {string} message - Descriptive error message explaining the runtime problem.
     * @param {number} statusCode - An HTTP-like status code for categorizing the error.
    */
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
};

module.exports = RuntimeError;