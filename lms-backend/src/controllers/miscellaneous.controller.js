import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/sendEmail.js";

/*
    1. This is contact us controller
       This will go as: POST {{url}}/api/v1/contact
*/
export const contactUs = asyncHandler(async(req, res, next) => {
    // Destructuring the required data from req.body form data
    const { name, email, message } = req.body;

    // Checking if values are valid
    if (!name || !email || !message) {
        return next(new AppError('Name, Email, Message are required'));
    }

    try {
        const subject = 'Contact Us Form';
        const textMessage = `<b>Name:</b> ${name} <br/><b>Email:</b> ${email} <br/><b>Message:</b> ${message}`
        
        // send the email to code_acad
        await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
    } catch (error) {
        console.log("Error: ", error);
        return next(new AppError(error.message, 400));
    }

    res.status(200).json({
        success: true,
        message: 'Your request has been submitted successfully'
    });
});

/*
    2. This is controller is for 'subscribers stats for the admin'
       This will go as: POST {{url}}/api/v1/admin/stats/users
*/
export const userStats = asyncHandler(async (req, res, next) => {
    // users count will be = no. of user records in the database
    const allUsersCount = await User.countDocuments();

    // subscribed users count: users whos subscription status = active
    const subscribedUsersCount = await User.countDocuments({
        'subscription.status': 'active', // subscription.status means we are going inside an object and we have to put this in quotes
    });

    res.status(200).json({
        success: true,
        message: 'All registered users count',
        allUsersCount,
        subscribedUsersCount,
    });
});