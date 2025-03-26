import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './schemas/user.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatMember, ChatMemberSchema } from './schemas/chat-member.schema';
import {
  MessageStatus,
  MessageStatusSchema,
} from './schemas/message-status.schema';
import { MongoUserRepository } from './repositories/mongo-user.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get<string>('MONGO_URL')}`,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: ChatMember.name, schema: ChatMemberSchema },
      { name: MessageStatus.name, schema: MessageStatusSchema },
    ]),
  ],
  providers: [MongoUserRepository],
  exports: [MongooseModule, MongoUserRepository],
})
export class MongoModule {}
