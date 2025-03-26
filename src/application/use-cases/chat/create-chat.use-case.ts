import { Inject, Injectable } from '@nestjs/common';
import { ChatEntity } from '../../../domain/entities/chat.entity';
import { ChatRepository } from '../../../domain/repositories/chat-repository.interface';
import {
  CreateChatDto,
  CreateChatSchema,
} from 'src/application/dto/create-chat.dto';

@Injectable()
export class CreateChatUseCase {
  constructor(
    @Inject('ChatRepository')
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(data: CreateChatDto): Promise<ChatEntity> {
    const validatedData = CreateChatSchema.parse(data);

    const existingChat = await this.chatRepository.getChatByParticipants(
      validatedData.participants,
    );

    if (existingChat) {
      return existingChat;
    }

    const chat = new ChatEntity(
      '',
      validatedData.participants.length > 2,
      validatedData.createdBy,
      new Date(),
    );

    const newChat = await this.chatRepository.createChat(chat);

    for (const participant of validatedData.participants) {
      await this.chatRepository.addParticipant(newChat.chatId, participant);
    }

    return newChat;
  }

  async getReceiverId(
    chatId: string,
    senderId: string,
  ): Promise<string | null> {
    const members = await this.chatRepository.getChatMembers(chatId);
    return members.find((id) => id !== senderId) || null;
  }
}
