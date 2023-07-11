import express from 'express';

import { getTheme, addTheme, editTheme, handleLogoImage, uploadLogoImage } from '../controllers/themeController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.route('/')
    .get(getTheme)
    .post(addTheme)
    .patch(protect, restrictTo(['admin']), editTheme);

router.route('/logo')
    .post(protect, restrictTo(['admin']), handleLogoImage, uploadLogoImage)

export default router;
