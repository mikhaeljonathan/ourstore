import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Email from '../utils/email.js';

import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from 'crypto';

import User from "../models/userModel.js";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // remove password from the output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

// check if current user is admin
export const isAdmin = async (req) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return false;

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (currentUser && currentUser.role === 'admin') {
        return true;
    }

    return false;
};

export const checkJWT = catchAsync(async (req, res, next) => {
    createSendToken(req.user, 200, res);
});

// equivalent to addUser
export const signup = catchAsync(async (req, res, next) => {
    const newUser = new User(req.body);
    const OTP = crypto.randomBytes(16).toString("hex");;
    newUser.otp = OTP;

    await newUser.save();
    await new Email(newUser).sendOTP(OTP);

    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password exists
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // if everything ok, send token to client
    createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
    // getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to gain access', 401));
    }

    // verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401));
    }

    // check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //     return next(new AppError('User has recently changed password! Please log in again', 401));
    // }

    req.user = currentUser; // this line is used for the next middleware, e.g. restrictTo
    next();
})

export const restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}

export const forgotpassword = catchAsync(async (req, res, next) => {
    // get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email address', 404));
    }

    // generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // send it to user's email
    // const resetURL = `${req.protocol}://${req.hostname}/reset/${resetToken}`;
    const resetURL = `https://skripsipastia.xyz/reset/${resetToken}`;

    try {
        await new Email(user).sendPasswordReset(resetURL);

        return res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    }

    return next(new AppError('There was an error sending the email. Try again later!'), 500);

});

export const checkResetToken = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // if token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    req.user = user;
    next();
});

export const resetpassword = catchAsync(async (req, res, next) => {
    // get user based on the token
    const user = req.user;

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user in send JWT
    createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if password is correct
    if (!(await user.correctPassword(req.body.password, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // If so, update the password
    user.password = req.body.newpassword;
    await user.save();

    // Log the user in, send JWT
    createSendToken(user, 200, res);
});

export const verifyOTP = catchAsync(async (req, res, next) => {
    const user = req.user;

    // check if the OTP inputted and generated are the same
    if (user.otp !== req.body.otp) {
        return next(new AppError('Your OTP is not match.', 400))
    }

    // If so, update the verified status
    user.verified = true;
    await user.save();

    res.sendStatus(200);
});