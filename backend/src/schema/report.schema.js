import { z } from 'zod';

export const reportSchema = z.object({
    body: z.object({
        reason: z.string().min(5, 'Minimal 5 karakter')
    })
});