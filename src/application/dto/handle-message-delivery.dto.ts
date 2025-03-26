import { z } from 'zod';

export const HandleMessageDeliverySchema = z.object({
  message: z.object({
    messageId: z.string().min(1, 'messageId harus diisi'),
    receiverId: z.string().min(1, 'receiverId harus diisi'),
    content: z.string().optional(),
    messageType: z.enum(['text', 'image', 'video', 'file']).optional(),
  }),
  receiverSocketId: z.string().optional(),
  server: z.any().refine((val) => typeof val.emit === 'function', {
    message: 'Server harus memiliki metode emit()',
  }),
});

export type HandleMessageDeliveryDto = z.infer<
  typeof HandleMessageDeliverySchema
>;
