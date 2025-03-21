import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password harus memiliki minimal 6 karakter'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
