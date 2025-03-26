import { z } from 'zod';

export const MessageReadSchema = z.object({
  messageId: z.string().min(1, 'messageId harus diisi'),
});

export type MessageReadDTO = z.infer<typeof MessageReadSchema>;
