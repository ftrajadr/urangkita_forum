import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { createTopicSchema, editTopicSchema } from '../schema/topic.schema.js';
import { createTopic, getTopic, editTopic, deleteTopic, getAllTopic, getAllTopicByUserId, getAllCategories } from '../controllers/topic.controller.js';

const router = express.Router();

router.get('/', getAllTopic);
router.get('/user/:userId', getAllTopicByUserId);
router.get('/:topicId', getTopic);
router.get('/category/list', getAllCategories);

router.post('/', protectedRoute, validate(createTopicSchema), createTopic);
router.put('/:topicId', protectedRoute, validate(editTopicSchema), editTopic);
router.delete('/:topicId', protectedRoute, deleteTopic);

export default router;