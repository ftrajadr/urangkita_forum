import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRoute from './routes/auth.route.js';
import topicRoute from './routes/topic.route.js';
import commentRoute from './routes/comment.route.js';
import userRoute from './routes/user.route.js';
import reportRoute from './routes/report.route.js';

import { globalErrorHandler } from './middlewares/globalerror.middleware.js';

const app = express();

// Security Middlewares & Parsing
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100, // Max 100 Request Per IP in 15 Minutes
    message: "Too many request, try again later..."
});
if (process.env.NODE_ENV === 'production') {
    app.use('/api', limiter);
}

// Routes
app.use('/api/auth', authRoute);
app.use('/api/topic', topicRoute);
app.use('/api/comment', commentRoute);
app.use('/api/user', userRoute);
app.use('/api/report', reportRoute);

// 404 Page Not Found
app.use((req, res, next) => {
    const err = new Error(`Halaman ${req.originalUrl} tidak ditemukan`);
    err.statusCode = 404;
    next(err);
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;