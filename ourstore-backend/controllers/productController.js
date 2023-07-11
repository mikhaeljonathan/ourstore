import Product from "../models/productModel.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

import multer from 'multer';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const multerStorage = multer.memoryStorage();

const FE_HOSTNAME = process.env.FE_HOSTNAME || 'localhost';
const FE_PORT = process.env.FE_PORT || 3000;

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    } else {
        return cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

export const handleProductPhotos = upload.array('images', 10);

export const uploadProductPhotos = catchAsync(async (req, res, next) => {
    if (req.files.length === 0) return next();

    req.body.images = [];
    await Promise.all(
        req.files.map(async (file, i) => {
            const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

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
                .resize(500, 500)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .pipe(stream);

            req.body.images.push({
                imageLink: `https://storage.googleapis.com/${bucketName}/${filename}`
            });

        }));

    next();
});

export const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        status: 'success',
        data: products
    });
});

export const addProduct = catchAsync(async (req, res, next) => {
    const newProduct = new Product({
        price: req.body.price,
        name: req.body.name,
        description: req.body.description,
        images: req.body.images
    });
    await newProduct.save();

    res.status(201).json({
        status: 'success',
        data: newProduct
    });
});

export const getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError(`No product found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: product
    });
});

export const editProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError(`No product found with ID ${req.params.id}`, 404));
    }

    // assign the properties one by one
    if (req.body.name) {
        product.name = req.body.name;
    }

    if (req.body.price) {
        product.price = req.body.price;
    }

    if (req.body.description) {
        product.description = req.body.description;
    }

    if (req.body.images) {
        product.images = req.body.images;
    }

    const editedProduct = new Product(product);
    await editedProduct.save();
    // await product.save();

    res.status(200).json({
        status: 'success',
        data: product
    });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
        return next(new AppError(`No product found with ID ${req.params.id}`, 404));
    }

    res.sendStatus(204);
});


export const getCheckoutSession = catchAsync(async (req, res, next) => {
    // Get the current product
    const product = await Product.findById(req.params.id);

    // Create checkout session
    // const session = await stripe.checkout.sessions.create({
    //     payment_method_types: ['card'],
    //     success_url: `${req.protocol}://${req.get('host')}/`,
    //     cancel_url: `${req.protocol}://${req.get('host')}/product/${product.slug}`,
    //     customer_email: req.user.email,
    //     client_reference_id: req.params.id,
    //     line_items: [
    //         {
    //             name: product.name,
    //             description: product.description,
    //             images: [`https://picsum.photos/200/300`],
    //             amount: product.price,
    //             currency: 'idr',
    //             quantity: 1
    //         }
    //     ]
    // })
    // console.log(product.images.map(imageLink => imageLink.imageLink));
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.protocol}://${FE_HOSTNAME}:${FE_PORT}/success-buy`,
        // cancel_url: `${req.protocol}://${req.get('host')}/product/${product.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        line_items: [
            {
                price_data: {
                    currency: 'idr',
                    unit_amount: product.price * 100,
                    product_data: {
                        name: product.name,
                        description: product.description,
                        // images: [`https://picsum.photos/200/300`],
                        images: product.images.map(i => i.imageLink)
                    },
                },
                quantity: 1,
            },
        ],
    });

    // Create session as response
    res.status(200).json({
        status: 'success',
        session
    })
})