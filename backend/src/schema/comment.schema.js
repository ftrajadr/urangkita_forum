import { z } from 'zod';

export const createCommentSchema = z.object({
    body: z.object({
        content: z.string()
        .min(2, 'Komentar terlalu pendek')
        .max(1000, 'Komentar terlalu panjang')
    })
});

export const editCommentSchema = z.object({
    body: z.object({
        content: z.string().min(2).max(1000).optional()
    })
});