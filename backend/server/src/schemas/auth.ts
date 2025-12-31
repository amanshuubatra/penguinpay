import { z } from 'zod';

export const signupSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username must be alphanumeric'),
        displayName: z.string().min(1),
        recaptchaToken: z.string().optional() // Optional for now to not break dev without keys
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
        recaptchaToken: z.string().optional()
    })
});
