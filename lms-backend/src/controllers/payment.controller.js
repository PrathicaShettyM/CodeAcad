import crypto from 'crypto';
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/payment.model.js";
import AppError from "../utils/appError.js";
import { razorpay } from '../../server.js';
import Payment from '../models/payment.model.js';

/*
    1. This is a buy subscription controller(private: only for logged in users)
       This goes as POST: {{URL}}/api/v1/payments/subscribe
*/
export const buySubscription = asyncHandler(async (req, res, next) => {
    // extracting ID from request obj
    const { id } = req.user;

    // find user by id
    const user = await User.findById(id);

    // if user doesnt exist, ask to login again
    if (!user) {
        return next(new AppError('Unauthorized, please login'));
    }

    // Checking the user role
    if (user.role === 'ADMIN') {
        return next(new AppError('Admin cannot purchase a subscription', 400));
    }

    // create a new subscription
    const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID, // unique plan id
        customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
        total_count: 12, // 12 means it will charge every month for a 1-yr subscription
    });

    // adding subsciption id and status to the use account
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    // saving user object to the DB
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Subscribed successfully',
        subscription_id: subscription.id,
    });
});

/*
    2. This is a verify subscription controller(private: only for logged in users)
       This goes as POST: {{URL}}/api/v1/payments/verify
*/
export const verifySubscription = asyncHandler(async (req, res, next) => {
    const {id} = req.user;
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;

    // finding the user
    const user = await User.findById(id);

    // Getting the subscription ID from the user object
    const subscriptionId = user.subscription.id;

    // generating a signature  with sha256 for verification purposes
    // subscriptionId shd be the one which we saved in the DB
    // razorpay_payment_id is from the frontend and  there shb be a '|' character between this and subscriptionId
    // at the end convert it to hex value
    const generatedSignature = crypto
        .createHmac('sha256'. process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');

    // now chech if the generated signature and signature received from the frontend is same or not
    if(generatedSignature !== razorpay_signature){
        return next(new AppError('Payment not verified, please try again', 400));
    }

    // If they match, create payment and store it in the DB
    await Payment.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
    });

    // update the user subscription status to active (this is will be create before this)
    user.subscription.status = 'active';

    // save the changes to the DB
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
    });
});

/*
    3. This is a cancel subscription controller(private: only for logged in users)
       This goes as POST: {{URL}}/api/v1/payments/unsubscribe
*/
export const cancelSubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.user;

    // find the user in the db
    const user = await User.findById(id);

    // check the user role - coz admins cant cancel a subscription
    if(user.role === 'ADMIN'){
        return next(new AppError('Admins cannot cancel subscription', 400));
    }

    // find the subscription id from the user object 
    const subsciptionId = user.subscription.id;

    // cancel the subscription using susbcriptionId
    try {
        const subscription = await razorpay.subscriptions.cancel(subsciptionId);
        
        // adding the susbcription status to the user account
        user.subscription.status = subscription.status;

        // save the user object to the DB
        await user.save();
    } catch (error) {
        // Returning error if any, and this error is from razorpay so we have statusCode and message built in
        return next(new AppError(error.error.description, error.statusCode));
    }

    // finding the payments using suscriptionId
    const payment = await Payment.findOne({
        razorpay_subscription_id: subsciptionId,
    });

    // getting the time from the date of successful payment (in milli seconds)
    const timeSinceSubscribed = Date.now() - payment.createdAt;

    // refend period which in our case is 14 days
    const refundPeriod = 14*24*60*60*1000;

    // check if the refund period is expired or not
    if(refundPeriod <= timeSinceSubscribed){
        return next(new AppError('Refund period is over, so there will not be any refunds provided', 400));
    }

    // if the refund period is valid, then refund the full amount to the user who had purchased the susbscription
    await razorpay.payments.refund(payment.razorpay_payment_id, {
        speed: 'optimum', // this is required
    });

    user.subscription.id = undefined; // remove the subscription ID from user DB
    user.subscription.status = undefined; // cancel the subscription status

    await user.save();
    await payment.remove();

    // send response
    res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully',
    });
});

/*
    4. This is a get razorpay api key controller
       This goes as POST: {{URL}}/api/v1/payments/razorpay-key
*/
export const getRazorpayApiKey = asyncHandler(async (_req, res, _next) => {
    res.status(200).json({
        success: true,
        message: 'Razorpay API key',
        key: process.env.RAZORPAY_KEY_ID
    });
});

/*
    5. This is a get all payments controller(private: accessible by admins only)
       This goes as GET: {{URL}}/api/v1/payments
*/
export const allPayments = asyncHandler(async (req, res, _next) => {
    const {count, skip} = req.query;

    // find all susbcriptions from razorpay
    const allPayments = await razorpay.subscriptions.all({
        count: count ? count : 10, // if count is sent then use tht else default to 10
        skip: skip ? skip: 0, // If skip is sent then use tht else default to 0
    });

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const finalMonths = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
    };

    const monthlyWisePayment = allPayments.items.map((payment) => {
        // we are using payment.start_at which is in unix time, so we are converting it to a Human readable format using Date()
        const monthInNumbers = new Date(payment.start_at * 1000);

        return monthNames[monthInNumbers.getMonth()];
    });

    monthlyWisePayment.map((month) => {
        Object.keys(finalMonths).forEach((objMonth) => {
            if(month === objMonth){
                finalMonths[month] += 1;
            }
        });
    });

    const monthlySalesRecord = [];

    Object.keys(finalMonths).forEach((monthName) => {
        monthlySalesRecord.push(finalMonths[monthName]);
    });

    res.status(200).json({
        success: true,
        message: 'All payments',
        allPayments,
        finalMonths,
        monthlySalesRecord,
    });
});