import express from 'express';
import { validate } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../schema/auth.schema.js';
import { register, login, logout, sendUserData } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/me', sendUserData);

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

export default router;