import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { createCommentSchema, editCommentSchema } from '../schema/comment.schema.js'
import { createComment, getComment, editComment, deleteComment, getAllCommentByTopic } from '../controllers/comment.controller.js';

const router = express.Router();

router.get('/topic/:topicId', getAllCommentByTopic);
router.get('/:commentId/topic/:topicId', protectedRoute, getComment)

router.post('/topic/:topicId', protectedRoute, validate(createCommentSchema), createComment);
router.put('/:commentId/topic/:topicId', protectedRoute, validate(editCommentSchema), editComment);
router.delete('/:commentId/topic/:topicId', protectedRoute, deleteComment);

export default router;