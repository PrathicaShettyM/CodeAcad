import crypto from 'crypto';

import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    minlength: [5, 'Full name must be at least 5 characters long'],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill in a valid email address',
    ], // Matches email against regex
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select:false, // Will not select password upon looking up a document
  },
  subscription: {
    id: String,
    status: String,
  },
  avatar: {
    public_id: {
        type: String,
    },
    secure_url: {
        type: String,
    },
  },
  role: {
    type: String,
    enum : ['USER', 'ADMIN'],
    default: 'USER',
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
}, {
    timestamps: true,
});

// 1. encrypt password before storing into the db
userSchema.pre('save', async function (next) {
    // if the password is not modified, skip hashing
    if(!this.isModified('password')) return next();

    // hash the password
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
    // 1. compare the plain password entered by user with the hashed password in the db
    comparePassword: async function (plainPassword){
        return await bcrypt.compare(plainPassword, this.password)
    },

    // 2. generate a JWT token for the user on sucessful login
    generateJWTToken: async function () {
        return await jwt.sign(
            {   
                id: this._id, 
                role: this.role, 
                subscription: this.subscription
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRY, 
            }
        );
    },

    // 3. generate a forgot password token
    generatePasswordResetToken: async function () {
        // generate a random token using crypto module
        const resetToken = crypto.randomBytes(20).toString('hex');

        // hash the above generated resetToken with sha256 algorithm and store it in the db
        this.forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // set the expiry time as '15 mins' for the token
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

        return resetToken;
  }
};

const User = model('User', userSchema);
export default User;