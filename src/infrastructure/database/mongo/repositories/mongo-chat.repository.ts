import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDocument, Chat } from '../schemas/chat.schema';
import { ChatEntity } from '../../../../domain/entities/chat.entity';
import { ChatRepository } from '../../../../domain/repositories/chat-repository.interface';
import { ChatMember, ChatMemberDocument } from '../schemas/chat-member.schema';

@Injectable()
export class MongoChatRepository implements ChatRepository {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(ChatMember.name)
    private readonly chatMemberModel: Model<ChatMemberDocument>,
  ) {}

  private toDomain(chat: ChatDocument): ChatEntity {
    return new ChatEntity(
      chat._id.toString(),
      chat.isGroup,
      chat.createdBy,
      chat.createdAt,
    );
  }

  async createChat(chat: ChatEntity): Promise<ChatEntity> {
    const createdChat = await this.chatModel.create({
      isGroup: chat.isGroup,
      createdBy: chat.createdBy,
      createdAt: chat.createdAt,
    });

    return this.toDomain(createdChat);
  }

  async getChatById(chatId: string): Promise<ChatEntity | null> {
    const chat = await this.chatModel.findOne({ chatId }).exec();
    return chat ? this.toDomain(chat) : null;
  }

  async getChatByParticipants(
    participants: string[],
  ): Promise<ChatEntity | null> {
    const chatMembers = await this.chatMemberModel
      .find({ userId: { $in: participants } })
      .exec();

    const chatIds = chatMembers.map((member) => member.chatId);

    const chat = await this.chatModel
      .findOne({ chatId: { $in: chatIds }, isGroup: false })
      .exec();

    return chat ? this.toDomain(chat) : null;
  }

  async addParticipant(
    chatId: string,
    userId: string,
    role: 'admin' | 'member' = 'member',
  ): Promise<void> {
    await this.chatMemberModel.create({
      chatId,
      userId,
      role,
      joinedAt: new Date(),
    });
  }

  async getChatMembers(chatId: string): Promise<string[]> {
    const members = await this.chatMemberModel.find({ chatId }).exec();
    return members.map((member) => member.userId);
  }
}
