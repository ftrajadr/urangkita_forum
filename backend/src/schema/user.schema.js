import { z } from 'zod';

export const editProfileSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(20).optional()
    })
});