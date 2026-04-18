import { z } from 'zod';

export const createTopicSchema = z.object({
    body: z.object({
        categoryId: z.number().min(1, 'Kategori dibutuhkan'),
        title: z.string()
        .min(5, 'Judul minimal 5 karakter')
        .max(255, 'Judul maksimal 255 karakter'),
        content: z.string().min(10, 'Konten minimal 10 karakter')
    })
});

export const editTopicSchema = z.object({
    body: z.object({
        categoryId: z.number().min(1).optional(),
        title: z.string().min(5).max(255).optional(),
        content: z.string().min(10).optional()
    })
});