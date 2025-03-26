import { z } from 'zod';

export const SendMessageSchema = z.object({
  chatId: z.string().min(1, 'chatId harus diisi'),
  senderId: z.string().min(1, 'senderId harus diisi'),
  receiverId: z.string().min(1, 'receiverId harus diisi'),
  content: z.string().min(1, 'Pesan tidak boleh kosong'),
  messageType: z.enum(['text', 'image', 'video', 'file']),
});

export type SendMessageDto = z.infer<typeof SendMessageSchema>;
