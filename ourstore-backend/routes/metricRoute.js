import express from 'express';

import { getMetric, addMetric, editMetric } from '../controllers/metricController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.route('/')
    .get(protect, restrictTo(['admin']), getMetric)
    .post(protect, restrictTo(['admin']), addMetric)
    .patch(protect, restrictTo(['admin']), editMetric);

export default router;
