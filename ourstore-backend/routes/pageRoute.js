import express from 'express';

import { getAllPages, addPage, getPage, editPage, deletePage, handlePagePhotos, uploadPagePhotos } from '../controllers/pageController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.route('/')
    .get(getAllPages)
    .post(protect, restrictTo(['admin']), addPage);

router.route('/images')
    .post(protect, restrictTo(['admin']), handlePagePhotos, uploadPagePhotos)

router.route('/:id')
    .get(getPage)
    .patch(protect, restrictTo(['admin']), editPage)
    .delete(protect, restrictTo(['admin']), deletePage);

export default router;
