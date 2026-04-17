import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.util.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return sendError(res, 'Silahkan login terlebih dahulu...', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        return sendError(res, 'Token invalid atau kedaluwarsa', 401);
    }
}

export const adminRoute = async (req, res, next) => {
    try {
        const userRole = req.user.role;

        if (userRole !== 'admin') {
            return sendError(res, 'Kamu bukan admin', 401);
        }

        next();
    } catch (err) {
        return sendError(res, err.message);
    }
}