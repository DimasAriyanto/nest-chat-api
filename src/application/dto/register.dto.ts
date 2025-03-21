import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(3, 'Username harus memiliki minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password harus memiliki minimal 6 karakter'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
