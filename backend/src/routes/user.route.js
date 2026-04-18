import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { editProfileSchema } from '../schema/user.schema.js';
import { getUserProfile, editUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.put('/me', protectedRoute, validate(editProfileSchema), editUserProfile);

export default router;