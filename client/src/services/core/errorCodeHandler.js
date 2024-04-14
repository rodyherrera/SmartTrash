/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/rodyherrera/SmartTrash/
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
****/

/**
 * @constant ERROR_CODES
 * @description A comprehensive object mapping error codes to human-readable error messages.
*/
const ERROR_CODES = {
    'Network Error': 'An error occurred while attempting to communicate with the server. Please check your internet connection and try again later.',

    'Database::Cast::Error': 'Error encountered while converting data types in the database. This may occur when attempting to save data with an incompatible type.',
    'Database::Validation::Error': 'Validation error detected in the database. This typically happens when data fails to meet certain criteria or constraints specified in the database schema.',
    'Database::Duplicated::Fields': 'Duplicate fields found in the database. This error indicates an attempt to insert or update data that would result in duplicate entries for unique fields.',

    'JWT::Error': 'Error encountered while processing the JSON Web Token (JWT) for authentication. This could be due to various issues such as invalid token format or signature.',
    'JWT::Expired': 'The JSON Web Token (JWT) used for authentication has expired. Authentication tokens have a limited lifespan for security reasons, and this error indicates that the token is no longer valid due to expiration.'
};

/**
 * @constant DEFAULT_ERROR_MESSAGE
 * @description A generic error message used as a fallback when no specific mapping is found in `ERROR_CODES`.
*/
const DEFAULT_ERROR_MESSAGE = 'An unknown error has occurred, please try again or later.';

/**
 * @function errorCodeHandler
 * @description Translates error codes into user-friendly error messages.
 * @param {string} errorCode - The error code received from the server or an internal source.
 * @returns {string} A human-readable error message.
*/
const errorCodeHandler = (errorCode) => {
    console.error('[SmartTrash Client]: Error ->', errorCode);
    const readableError = ERROR_CODES?.[errorCode] || DEFAULT_ERROR_MESSAGE;
    return readableError;
};

export default errorCodeHandler;