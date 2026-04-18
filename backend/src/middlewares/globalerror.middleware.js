import { sendError } from "../utils/response.util.js";

export const globalErrorHandler = (err, req, res, next) => {
    console.log('Global Error: ', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Terjadi kesalahan internal pada server';

    return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
}