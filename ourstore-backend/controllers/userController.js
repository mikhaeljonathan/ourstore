import User from "../models/userModel.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

export const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: users
    });
});

// addUser is in authController.js

export const getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError(`No user found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: user
    });
});

export const editUser = catchAsync(async (req, res, next) => {
    const editedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!editedUser) {
        return next(new AppError(`No user found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: editedUser
    });
});

export const updateMe = catchAsync(async (req, res, next) => {
    // create error if user post password data
    if (req.body.password) {
        return next(new AppError("This route is not for password updates. Please use /updatepassword"), 400);
    }

    // filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'username', 'email', 'role');

    // update user document
    const editedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: editedUser
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const deleteUser = catchAsync(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return next(new AppError(`No user found with ID ${req.params.id}`, 404));
    }

    res.sendStatus(204);
});
