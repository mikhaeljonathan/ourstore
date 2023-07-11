import Page from "../models/pageModel.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

import multer from 'multer';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

import { isAdmin } from "./authController.js";

import dotenv from 'dotenv';
dotenv.config();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    } else {
        return cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
}

const multerStorage = multer.memoryStorage();

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

export const handlePagePhotos = upload.single('image');

export const uploadPagePhotos = catchAsync(async (req, res, next) => {
    const filename = `page-${Date.now()}.jpeg`;
    const file = req.file;

    // set up GCP
    const projectId = process.env.PROJECT_ID;
    const keyFilename = JSON.parse(process.env.KEY_FILENAME);
    const bucketName = process.env.BUCKET_NAME;

    const storage = new Storage({
        projectId: projectId,
        credentials: keyFilename
    });
    const bucket = storage.bucket(bucketName);

    const gcsFile = bucket.file(filename);
    const stream = gcsFile.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    });

    await sharp(file.buffer)
        .toFormat('jpeg')
        .pipe(stream);

    
    const imageLink = `https://storage.googleapis.com/${bucketName}/${filename}`
    
    res.status(201).json({
        status: 'success',
        data: imageLink
    })
    
});

export const getAllPages = catchAsync(async (req, res, next) => {
    // show inactive pages if admin queries it
    let queryOption = undefined;
    if (!(await isAdmin(req))) {
        queryOption = {
            isActive: true
        }
    }

    // find the pages with the option query
    const pages = await Page.find(queryOption);

    res.status(200).json({
        status: 'success',
        data: pages
    });
});

export const addPage = catchAsync(async (req, res, next) => {
    const newPage = new Page(req.body);
    await newPage.save();

    res.status(201).json({
        status: 'success',
        data: newPage
    });
});

export const getPage = catchAsync(async (req, res, next) => {
    const page = await Page.findById(req.params.id);

    // if page not found or if page is not active and who queries it not an admin
    if (!page || (!page.isActive && !(await isAdmin(req)))) {
        return next(new AppError(`No page found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: page
    });
});

export const editPage = catchAsync(async (req, res, next) => {
    const page = await Page.findById(req.params.id);

    if (!page) {
        return next(new AppError(`No page found with ID ${req.params.id}`, 404));
    }

    // assign the properties one by one
    if (req.body.name) {
        page.name = req.body.name;
    }

    if (req.body.hasOwnProperty("isActive")) {
        page.isActive = req.body.isActive;
    }

    if (req.body.hasOwnProperty("isInHeader")) {
        page.isInHeader = req.body.isInHeader;
    }

    if (req.body.sections) {
        page.sections = req.body.sections;
    }

    const editedPage = new Page(page);
    await editedPage.save();
    // await page.save();

    res.status(200).json({
        status: 'success',
        data: page
    });
});

export const deletePage = catchAsync(async (req, res, next) => {
    const deletedPage = await Page.findByIdAndDelete(req.params.id);

    if (!deletedPage) {
        return next(new AppError(`No page found with ID ${req.params.id}`, 404));
    }

    res.sendStatus(204);
});
