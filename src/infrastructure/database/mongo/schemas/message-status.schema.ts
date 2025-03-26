import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageStatusDocument = HydratedDocument<MessageStatus>;

@Schema({ timestamps: true })
export class MessageStatus {
  @Prop({ required: true })
  messageId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ enum: ['sent', 'delivered', 'read'], required: true })
  status: 'sent' | 'delivered' | 'read';

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const MessageStatusSchema = SchemaFactory.createForClass(MessageStatus);
