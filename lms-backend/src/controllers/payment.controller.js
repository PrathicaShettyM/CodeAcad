import crypto from 'crypto';
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/payment.model.js";
import AppError from "../utils/appError.js";
import { razorpay } from '../../server.js';

/*
    1. This is a buy subscription controller(private: only for logged in users)
       This goes as POST: {{URL}}/api/v1/payments/subscribe
*/





/*
    2. This is a verify subscription controller(private: only for logged in users)
       This goes as POST: {{URL}}/api/v1/payments/verify
*/





/*
    3. This is a cancel subscription controller(private: only for logged in users)
       This goes as POST: {{URL}}/api/v1/payments/unsubscribe
*/






/*
    4. This is a get razorpay api key controller
       This goes as POST: {{URL}}/api/v1/payments/razorpay-key
*/





/*
    5. This is a get all payments controller(private: accessible by admins only)
       This goes as GET: {{URL}}/api/v1/payments
*/
