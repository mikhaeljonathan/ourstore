import express from 'express';

import { getAllUsers, getUser, editUser, deleteUser, updateMe, deleteMe } from '../controllers/userController.js';
import { signup, login, forgotpassword, resetpassword, protect, updatePassword, restrictTo, checkJWT, checkResetToken, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

router.post('/pass/forgot', forgotpassword);
router.patch('/pass/reset/:token', checkResetToken, resetpassword);
router.get('/pass/reset/token/check/:token', checkResetToken, (req, res) => res.sendStatus(200));
router.patch('/pass', protect, updatePassword);
router.get('/jwt/check', protect, checkJWT);

router.post('/login', login);
router.route('/')
    .get(protect, restrictTo(['admin']), getAllUsers)
    .patch(protect, updateMe)
    .delete(protect, deleteMe)
    .post(signup);

router.route('/me')
    .get(protect, (req, res) => res.status(200).send(req.user));

router.route("/otp")
    .patch(protect, verifyOTP);

router.route('/:id')
    .get(protect, restrictTo(['admin']), getUser)
    .patch(protect, restrictTo(['admin']), editUser)
    .delete(protect, restrictTo(['admin']), deleteUser);

export default router;
