import jwt from 'jsonwebtoken';

import AppError from "../utils/appError.js";
import asyncHandler from './asyncHandler.middleware';

// 1. Middleware to check if user "is Logged in" or not
export const isLoggedIn = asyncHandler(async (req, _res, next) => {
    // extract token from cookies
    const token = req.cookies;

    // If no token send unauthorized message
    if (!token) {
        return next(new AppError('Unauthorized, Please login to continue', 401));
    }

    // decoding the token using jwt verify method
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    
    // if no decoded token, send unauthorized message
    if(!decoded) {
        return next(new AppError('Invalid token, Please login again', 401));
    }
    // If token is valid, attach user info to request object
    req.user = decoded; 
    
    // pass on the control to the next middleware
    next();
});

// 2. Middleware to check if user is an "Admin" or not
export const authorizeRoles = (...roles) => {
    asyncHandler(async (req, _res, next) => {
        // If the user is not an Admin AND he doesnt have a active subscription, then throw error
        if (req.user.role !== 'Admin' && req.user.subscription.status !== 'active') {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        // If user is Admin, pass on the control to the next middleware
        next();
    });
};

// 3. Middleware to check if user is a active "Subscriber" or not
export const authorizeSubscriers = asyncHandler(async (req, _res, next) => {
    // If user is not logged in, throw an error
    if (!req.user) {
        return next(new AppError('Unauthorized, Please login to continue', 401));
    }

    // If user is logged in, check if their role is "Subscriber"
    if (req.user.role !== 'Subscriber') {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    // If user is a Subscriber, pass on the control to the next middleware
    next();
});