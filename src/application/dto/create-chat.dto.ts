import { z } from 'zod';

export const CreateChatSchema = z.object({
  participants: z
    .array(z.string().min(1, 'Setiap participant harus memiliki ID yang valid'))
    .min(2, 'Minimal dua participant diperlukan untuk membuat chat'),
  createdBy: z.string().min(1, 'createdBy harus diisi'),
});

export type CreateChatDto = z.infer<typeof CreateChatSchema>;
