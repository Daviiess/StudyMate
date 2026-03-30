import express, { Router } from 'express';
import {body} from 'express-validator'
import protect from '../middleware/auth.js';
import { changePassword, getProfile, LoginUser, registerUser, updateProfile } from '../controller/authController.js';
const router = express.Router();
const registerValidation = [
    body('username')
    .trim()
    .isLength({min: 3})
    .withMessage('username must be atleast 3 characters'),

    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

    body('password')
    .isLength({min: 6})
    .withMessage('Password must have atleast 6 characters')
];

router.post('/register' , registerValidation, registerUser)
router.post('/login' , registerValidation, LoginUser)



/* Protected routes */
router.get('/profile' , protect, getProfile);
router.put('/update-profile' , protect, updateProfile)
router.post('/change-password' , protect, changePassword);
export default router;