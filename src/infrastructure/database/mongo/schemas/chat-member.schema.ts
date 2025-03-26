import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatMemberDocument = HydratedDocument<ChatMember>;

@Schema({ timestamps: true })
export class ChatMember {
  @Prop({ required: true })
  chatId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ enum: ['admin', 'member'], default: 'member' })
  role: 'admin' | 'member';

  @Prop({ default: Date.now })
  joinedAt: Date;
}

export const ChatMemberSchema = SchemaFactory.createForClass(ChatMember);
