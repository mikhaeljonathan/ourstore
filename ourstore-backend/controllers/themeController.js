import Theme from "../models/themeModel.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

import multer from 'multer';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

import dotenv from 'dotenv';
dotenv.config();

export const getTheme = catchAsync(async (req, res, next) => {
    const theme = await Theme.find();
    res.status(200).json({
        status: 'success',
        data: theme
    });
});

export const addTheme = catchAsync(async (req, res, next) => {
    const searchedTheme = await Theme.find();
    if (searchedTheme.length > 0) {
        return next(new AppError('There is already a theme in the collection', 400));
    }

    const newTheme = new Theme(req.body);
    await newTheme.save();

    res.status(201).json({
        status: 'success',
        data: newTheme
    });
});

export const editTheme = catchAsync(async (req, res, next) => {
    let searchedTheme = await Theme.find();

    if (!searchedTheme) {
        return next(new AppError(`No theme found with ID ${req.params.id}`, 404));
    }

    const themeId = searchedTheme[0]._id.toString();

    searchedTheme = await Theme.findById(themeId);

    if (req.body.primary) {
        searchedTheme.primary = req.body.primary;
    }

    if (req.body.secondary) {
        searchedTheme.secondary = req.body.secondary;
    }

    if (req.body.templateId) {
        searchedTheme.templateId = req.body.templateId;
    }

    if (req.body.singleProductTemplateId) {
        searchedTheme.singleProductTemplateId = req.body.singleProductTemplateId;
    }

    if (req.body.viewType) {
        searchedTheme.viewType = req.body.viewType;
    }

    if (req.body.columnSize) {
        searchedTheme.columnSize = req.body.columnSize;
    }

    if (req.body.logoLink) {
        searchedTheme.logoLink = req.body.logoLink;
    }

    const editedTheme = new Theme(searchedTheme);
    await editedTheme.save();
    // await searchedTheme.save();

    res.status(200).json({
        status: 'success',
        data: searchedTheme
    });
});

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

export const handleLogoImage = upload.single('image');

export const uploadLogoImage = catchAsync(async (req, res, next) => {
    const filename = `logo-${Date.now()}.jpeg`;
    const file = req.file;

    // set up GCP
    const projectId = process.env.PROJECT_ID;
    const keyFilename = JSON.parse(process.env.KEY_FILENAME)
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

// export const deleteTheme = async (req, res) => {
//     try {
//         await Theme.findByIdAndDelete(req.params.id);
//         res.status(204).send('success');
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }
