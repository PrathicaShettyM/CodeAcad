import jwt from 'jsonwebtoken';
import AppError from "../utils/appError.js";
import asyncHandler from './asyncHandler.middleware.js';

// 1. Middleware to check if user "is Logged in" or not
export const isLoggedIn = asyncHandler(async (req, _res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new AppError('Unauthorized, Please login to continue', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
});

// 2. Middleware to check if user is in allowed roles
export const authorizeRoles = (...roles) =>
    asyncHandler(async (req, _res, next) => {
        const userRole = req.user?.role?.toUpperCase();

        const allowed = roles.map(r => r.toUpperCase());
        if (!allowed.includes(userRole)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    });

// 3. Middleware to check if user is a "SUBSCRIBER"
export const authorizeSubscribers = (req, res, next) => {
  if (
    req.user.role === "ADMIN" ||
    (req.user.subscription && req.user.subscription.status === "active")
  ) {
    return next();
  }
  return res.status(403).json({ message: "Access Denied. Please subscribe." });
};

