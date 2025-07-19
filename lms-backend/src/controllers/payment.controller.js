import crypto from 'crypto';
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.model.js"; // FIX: Was incorrectly pointing to payment.model.js
import AppError from "../utils/appError.js";
import { razorpay } from '../../server.js';
import Payment from '../models/payment.model.js';

/*
    1. Buy Subscription (Private)
    POST: /api/v1/payments/subscribe
*/
export const buySubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) return next(new AppError('Unauthorized, please login'));

    if (user.role === 'ADMIN') {
        return next(new AppError('Admin cannot purchase a subscription', 400));
    }

    if (!user.subscription) user.subscription = {};

    console.log("User ID:", id);
    console.log("User role:", user.role);
    console.log("Plan ID:", process.env.RAZORPAY_PLAN_ID);

    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            total_count: 12,
        });

        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Subscribed successfully',
            subscription_id: subscription.id,
        });
    } catch (err) {
        console.error("Razorpay Subscription Error:", err);
        return next(new AppError("Failed to create subscription", 500));
    }
});

/*
    2. Verify Subscription (Private)
    POST: /api/v1/payments/verify
*/
export const verifySubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;

    const user = await User.findById(id);
    if (!user) return next(new AppError("User not found", 404));

    const subscriptionId = user.subscription?.id;
    if (!subscriptionId) return next(new AppError("No active subscription found", 400));

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return next(new AppError('Payment verification failed', 400));
    }

    await Payment.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
    });

    user.subscription.status = 'active';
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
    });
});

/*
    3. Cancel Subscription (Private)
    POST: /api/v1/payments/unsubscribe
*/
export const cancelSubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) return next(new AppError("User not found", 404));

    if (user.role === 'ADMIN') {
        return next(new AppError('Admins cannot cancel subscription', 400));
    }

    const subscriptionId = user.subscription?.id;
    if (!subscriptionId) return next(new AppError("No subscription found", 400));

    try {
        const subscription = await razorpay.subscriptions.cancel(subscriptionId);
        user.subscription.status = subscription.status;
        await user.save();
    } catch (error) {
        console.error("Cancel Subscription Error:", error);
        return next(new AppError(error.error?.description || "Failed to cancel subscription", error.statusCode || 500));
    }

    const payment = await Payment.findOne({ razorpay_subscription_id: subscriptionId });
    if (!payment) return next(new AppError("Payment record not found", 404));

    const timeSinceSubscribed = Date.now() - payment.createdAt;
    const refundPeriod = 14 * 24 * 60 * 60 * 1000;

    if (timeSinceSubscribed > refundPeriod) {
        return next(new AppError('Refund period expired', 400));
    }

    try {
        await razorpay.payments.refund(payment.razorpay_payment_id, {
            speed: 'optimum',
        });

        user.subscription.id = undefined;
        user.subscription.status = undefined;
        await user.save();
        await payment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully',
        });
    } catch (refundErr) {
        console.error("Refund Error:", refundErr);
        return next(new AppError("Refund failed", 500));
    }
});

/*
    4. Get Razorpay Key
    GET: /api/v1/payments/razorpay-key
*/
export const getRazorpayApiKey = asyncHandler(async (_req, res, _next) => {
    res.status(200).json({
        success: true,
        message: 'Razorpay API key',
        key: process.env.RAZORPAY_KEY_ID
    });
});

/*
    5. Get All Payments (Admin only)
    GET: /api/v1/payments
*/
export const allPayments = asyncHandler(async (req, res, _next) => {
    const { count = 10, skip = 0 } = req.query;

    const allPayments = await razorpay.subscriptions.all({
        count,
        skip,
    });

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const finalMonths = Object.fromEntries(monthNames.map(month => [month, 0]));

    const monthlyWisePayment = allPayments.items.map(payment => {
        const monthIndex = new Date(payment.start_at * 1000).getMonth();
        return monthNames[monthIndex];
    });

    monthlyWisePayment.forEach(month => {
        if (finalMonths.hasOwnProperty(month)) {
            finalMonths[month]++;
        }
    });

    const monthlySalesRecord = monthNames.map(month => finalMonths[month]);

    res.status(200).json({
        success: true,
        message: 'All payments',
        allPayments,
        finalMonths,
        monthlySalesRecord,
    });
});
