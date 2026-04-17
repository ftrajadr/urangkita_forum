import express from 'express';
import { protectedRoute, adminRoute } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { reportSchema } from '../schema/report.schema.js';
import { reportUserAdd, reportUserList, reportUserIgnore, reportTopicAdd, reportTopicList, reportTopicIgnore, reportCommentAdd, reportCommentList, reportCommentIgnore } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/user', protectedRoute, adminRoute, reportUserList);
router.post('/user/:reportedId', protectedRoute, validate(reportSchema), reportUserAdd);
router.delete('/user/:id', protectedRoute, adminRoute, reportUserIgnore);

router.get('/topic', protectedRoute, adminRoute, reportTopicList);
router.post('/topic/:reportedTopicId', protectedRoute, validate(reportSchema), reportTopicAdd);
router.delete('/topic/:id', protectedRoute, adminRoute, reportTopicIgnore);

router.get('/comment', protectedRoute, adminRoute, reportCommentList);
router.post('/comment/:reportedCommentId/topic/:topicId', protectedRoute, validate(reportSchema), reportCommentAdd);
router.delete('/comment/:id', protectedRoute, adminRoute, reportCommentIgnore);

export default router;