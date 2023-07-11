import express from 'express';

import { getAllProducts, addProduct, getProduct, editProduct, deleteProduct, handleProductPhotos, uploadProductPhotos, getCheckoutSession } from '../controllers/productController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.route('/')
    .get(getAllProducts)
    .post(protect, restrictTo(['admin']), handleProductPhotos, uploadProductPhotos, addProduct);

router.route('/:id')
    .get(getProduct)
    .patch(protect, restrictTo(['admin']), handleProductPhotos, uploadProductPhotos, editProduct)
    .delete(protect, restrictTo(['admin']), deleteProduct);

router.route('/:id/checkout-session')
    .get(protect, getCheckoutSession);

export default router;
