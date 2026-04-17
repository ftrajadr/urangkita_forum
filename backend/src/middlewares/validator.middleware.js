import { sendError } from '../utils/response.util.js';
import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        next();
    } catch (err) {
        if (err instanceof ZodError) {
            const errorMessage = err.issues?.[0]?.message || 'Input tidak valid';
            return sendError(res, errorMessage, 400, err.issues);
        }

        return sendError(res, 'Terjadi kesalahan internal pada validasi', 500);
    }
}