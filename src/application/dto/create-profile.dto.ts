import { z } from 'zod';

export const CreateProfileSchema = z.object({
  userId: z.string().min(1, 'User ID harus diisi'),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  gender: z.enum(['male', 'female', 'other']),
  birthday: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Tanggal lahir tidak valid',
  }),
  horoscope: z.string().optional(),
  zodiac: z.string().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;
