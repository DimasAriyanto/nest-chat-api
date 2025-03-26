import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birthday: z
    .union([
      z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Tanggal lahir tidak valid',
      }),
      z.date(),
    ])
    .optional(),
  weight: z.number().positive().max(300).optional(),
  height: z.number().positive().max(250).optional(),
  zodiac: z.string().optional(),
  horoscope: z.string().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
