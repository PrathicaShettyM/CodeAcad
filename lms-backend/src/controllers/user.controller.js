import crypto from 'crypto';
import fs from 'fs/promises';
import cloudinary from 'cloudinary';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/appError.js';
import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';

const cookieOptions = {
    secure: process.env.NODE_ENV === 'production' ? true : false, // true if in production, false otherwise
    maxAge: 7*24*60*60*1000, // 7 days in milliseconds
    httpOnly: true, // cookie cannot be accessed via JavaScript to prevent XSS attacks
}

/*
    1. This is a user registration controller
       This goes as POST: {{url}}/api/v1/user/register
*/
export const registerUser = asyncHandler(async (req, res, next) => {
    // Destructuring the necessary data from req object
    const { fullName, email, password} = req.body;

    // Check if the data is there or not, if not throw error message
    if(!fullName || !email || !password) {
        return next(new AppError('Please fill all the fields', 400));
    }

    // Check if the user exists with the provided email
    const userExists = await User.findOne({email});
    // If user exists send the reponse
    if(userExists){
        return next(new AppError('Email already exists', 409));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email, // for now store email here
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg', // set a temporary cloudinary secure url, this can be changed by user later on
        },
    });
    
    // If user not created send message response
    if(!user){
        return next(new AppError('User registration failed, please try again later', 400));
    }

    // run only if user sends file
    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'code_acad', // save the files to a folder called code_acad
                width: 250,
                height: 250,
                gravity: 'faces', // this tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill'
            });

            if(result){
                // Set the public_id and secure_url in DB
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                
                // After successful upload remove the file from local storage
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            return next(new AppError(error || 'File not uploaded, please try again', 400));
        }
    }

    // Save the user object
    await user.save();

    // Generating a JWT token for the user
    const token = await user.generateJWTToken();

    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;

    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie('token', token, cookieOptions);

    // If all good send the response to the frontend
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    });
});

/*
    2. This is a user login controller
       This goes as POST: {{url}}/api/v1/user/login
*/
export const loginUser = asyncHandler(async (req, res, next) => {
    // Destructuring the necessary data from req object
    const { email, password } = req.body;

    // Check if the data is there or not, if not throw error message
    if (!email || !password) {
        return next(new AppError('Email and Password are required', 400));
    }

    // Finding the user with the sent email
    const user = await User.findOne({ email }).select('+password');

    // If no user or sent password do not match then send generic response
    const enteredPassword = await user.comparePassword(password);
    if(!(user && enteredPassword)){
        return next(new AppError('Email or Password do not match or user does not exist', 401));
    }

    // Generating a JWT token
    const token = await user.generateJWTToken();

    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;

    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie('token', token, cookieOptions);

    // If all good send the response to the frontend
    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user,
    });
});

/*
    3. This is a user logout controller
       This goes as POST: {{url}}/api/v1/user/logout
*/
export const logoutUser = asyncHandler(async (_req, res, _next) => {
    // set cookie values to null
    res.cookie('token', null, {
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 0,
        httpOnly: true,
    });

    // send response
    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    })
});

/*
    4. This is a user profile controller (private: only for logged in user)
       This goes as GET: {{url}}/api/v1/user/me
*/
export const getLoggedInUserDetails = asyncHandler(async (req, res, _next) => {
    // Fetch the user using the id from modified req object
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        message: 'User details',
        user,
    });
});

/*
    5. This is a forgot password controller 
       This goes as POST: {{url}}/api/v1/user/reset
*/
export const forgotPassword = asyncHandler(async (req, res, next) => {
    // Extracting email from request body (form data)
    const { email } = req.body;

    // If no email send email required message
    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    // Finding the user via email
    const user = await User.findOne({ email });

    // If no email found, send "email not found" message
    if (!user) {
        return next(new AppError('Email not registered', 400));
    }

    // Generating the reset token via the custo, method i used in the user model
    const resetToken = await user.generatePasswordResetToken();

    // save the forgetPassword to DB
    await user.save();

    // constructing a url to send the correct data
    // here: 1. req.protocol will send if http or https
    //       2. req.get('host') will get the hostname
    //       3. the rest is the route tht we will create to verify if token is correct or not
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // we here need to send an email to the user with the token

    // Password reset mail content:
    const subject = 'Reset Password';
    const message =  `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">
                        Reset your password</a>\n
                        If the above link does not work for some reason then copy paste this link in a new tab ${resetPasswordUrl}.\n 
                        If you have not request this, kindly ignore.`;

    try {
        // call this util to send the email
        await sendEmail(email, subject, message);

        // if email sent successfully then send the response
        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`
        });
    } catch (error) {
        // if there is some error, then we need to clear the forgetPassword* field in our DB
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save();

        return next(new AppError(error.message || 'Something went wrong, please try again.', 500));
    }
});

/*
    5. This is a reset password controller 
       This goes as POST: {{url}}/api/v1/user/reset/:resetToken
*/
export const resetPassword = asyncHandler(async (req, res, next) => {
    // extract resetToken from req.params(from the url) object
    const { resetToken } = req.params;

    // extract password from the req.body (form data)
    const { password } = req.body;

    // we are again hashing the resetToken using sha256, since we have stored our resetToken in the DB using the same algorithm
    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Check if password is not there then send response saying password is required
    if(!password){
        return next(new AppError('Password is required', 400));
    }

    console.log(forgotPasswordToken);

    // Checking if token matches in DB and if it is still valid(Not expired)
    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}, // $gt will help us check for greater than value, with this we can check if token is valid or expired
    })

    // If not found or expired send the response
    if (!user) {
        return next(new AppError('Token is invalid or expired, please try again', 400));
    }

    // Update the password if token is valid and not expired
    user.password = password;

    // make the forgetPassword values undefined in the DB
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    // save the updated user info in the db
    await user.save();

    // send the json response
    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    });
});

/*
    6. This is a change password controller 
       This goes as POST: {{URL}}/api/v1/user/change-password
*/
export const changePassword = asyncHandler(async (req, res, next) => {
    // Destructuring the necessary data from the req body (from data)
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user; // this is possible bcoz: of middleware isLoggedIn

    // Check if the values are given by the user or not
    if (!oldPassword || !newPassword) {
        return next(new AppError('Old password and new password are required', 400));
    }

    // Finding the user by ID and selecting the password
    const user = await User.findById(id).select('+password');

    // If no user then throw an error message
    if (!user) {
        return next(new AppError('Invalid user id or user does not exist', 400));
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    // If the old password is not valid then throw an error message
    if (!isPasswordValid) {
        return next(new AppError('Invalid old password', 400));
    }

    // Setting the new password
    user.password = newPassword;

    // Save the data in DB
    await user.save();

    // Setting the password undefined so that it won't get sent in the response
    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});

/*
    6. This is a update user controller 
       This goes as POST: {{URL}}/api/v1/user/:id
*/
export const updateUser = asyncHandler(async (req, res, next) => {
    // Destructuring the necessary data from the req object
    const { fullName } = req.body;
    const { id } = req.params;

    // Finding user by id
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError('Invalid user id or user does not exist'));
    }

    // If fullName is provided, update it
    if (fullName) {
        user.fullName = fullName;
    }

    // run this only when user changes his profile pic
    if (req.file) {
        // delete the old image uploaded by the user
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'code_acad', // save the files to a folder called code_acad
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill',
            });

            if (result) {
                // Set the new public_id and secure_url
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // After successful upload remove the file from local storage
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            return next(new AppError(error || 'File not uploaded, please try again', 400));
        }
    }

    // save the user object in the db
    await user.save();

    // send the success json response
    res.status(200).json({
        success: true,
        message: 'User details updated successfully',
    });
});
