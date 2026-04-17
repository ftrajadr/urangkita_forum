import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        username: z.string()
        .min(3, 'Username minimal 3 karakter')
        .max(20, 'Username maksimal 20 karakter')
        .regex(/^[a-zA-z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
        email: z.email('Format email tidak valid').max(100, 'Email maksimal 100 karakter'),
        password: z.string().min(8, 'Password minimal 8 karakter')
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email('Format email tidak valid'),
        password: z.string().min(1, 'Password wajib diisi')
    })
});