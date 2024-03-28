/**
 * Creates a new object containing only the specified fields from the original object.
 *
 * @param {Object} object - The original object to filter.
 * @param  {...string} fields -  The names of the fields to include in the filtered object.
 * @returns {Object} - A new object containing only the specified fields.
*/
exports.filterObject = (object, ...fields) => {
    const filteredObject = {};
    Object.keys(object).forEach((key) =>
        (fields.includes(key)) && (filteredObject[key] = object[key]));
    return filteredObject;
};

/**
 * Determines whether an ID is a MongoDB ObjectID or a slug.
 *
 * @param {string} id - The ID to evaluate.
 * @returns {Object} -  An object with a property of either '_id' (for ObjectIDs) or 'slug' (for slugs).
*/
exports.checkIfSlugOrId = (id) => {
    if(id.length === 24)
        return { _id: id };
    return { slug: id };
};

/**
 * Creates a middleware function to handle errors in asynchronous route handlers, optionally executing a cleanup function afterwards.
 *
 * @param {Function} asyncFunction - The asynchronous route handler function.
 * @param {Function} [finalFunction] - An optional cleanup function to execute after error handling.
 * @returns {Function} - A middleware function for Express routes.
*/
exports.catchAsync = (asyncFunction, finalFunction = undefined) => (req, res, next) => {
    let executeFinally = true;
    return asyncFunction(req, res, next)
        .catch(next)
        .catch(() => (executeFinally = false))
        .finally(() => setTimeout(() => 
            (executeFinally && typeof finalFunction === 'function') && (finalFunction(req)), 100));
};

module.exports = exports;