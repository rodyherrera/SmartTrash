const jwt = require('jsonwebtoken');
const User = require('@models/user');
const RuntimeError = require('@utilities/runtimeError');
const { promisify } = require('util');
const { catchAsync } = require('@utilities/runtime');
const { redisClient } = require('@utilities/redisClient');

/**
 * Extracts and verifies a JWT token from the Authorization header, then retrieves
 * the corresponding user.
 *
 * @param {string} token - The JWT token to verify and decode.
 * @returns {Promise<object>} - The user object if found, otherwise throws an error.
 * @throws {RuntimeError} - If the user is not found or password has changed after 
 *                          the token was issued.
*/
exports.getUserByToken = async (token, next) => {
    const decodedToken = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const cachedUser = await redisClient.get(`user:${decodedToken.id}`);
    if(cachedUser){
        return JSON.parse(cachedUser);
    }
    // Retrieve the user from the database
    const freshUser = await User.findById(decodedToken.id).select('-devices -__v');
    if(!freshUser){
        return next(new RuntimeError('Authentication::User::NotFound', 401));
    }
    await redisClient.set(`user:${decodedToken.id}`, JSON.stringify(freshUser));
    // Check if the user's password has changed since the token was issued
    if(await freshUser.isPasswordChangedAfterJWFWasIssued(decodedToken.iat)){
        return next(new RuntimeError('Authentication::PasswordChanged', 401));
    }
    return freshUser;
};

/**
 * Express middleware to protect routes. Fetches and validates a JWT token.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - Express next function to continue.
 * @throws {RuntimeError} - If no token provided or if authentication fails.
*/
exports.protect = catchAsync(async (req, res, next) => {
    // 1. Retrieve token from the request headers
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }else{
        return next(new RuntimeError('Authentication::Required', 401));
    }
    // 2. Verify token and retrieve the user
    const freshUser = await this.getUserByToken(token, next);
    // 3. Attach the user to the request object for subsequent middleware to use
    req.user = freshUser;
    next();
});

/**
 * Authorization middleware to restrict access based on user roles.
 *
 * @param {...string} roles - The allowed roles for the route.
 * @returns {import('express').RequestHandler} - Express middleware function.
*/
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // Check if the user role matches any allowed roles
        if(!roles.includes(req.user.role)){
            return next(new RuntimeError('Authentication::Unauthorized', 403));
        }
        next();
    };
};