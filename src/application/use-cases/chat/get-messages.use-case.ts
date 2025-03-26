import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../../../domain/repositories/message-repository.interface';
import { MessageEntity } from '../../../domain/entities/message.entity';

@Injectable()
export class GetMessagesUseCase {
  constructor(
    @Inject('MessageRepository')
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(chatId: string): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.getMessagesByChatId(chatId);

    if (!messages.length) {
      throw new NotFoundException('Tidak ditemukan pesan untuk chat ini.');
    }

    return messages;
  }
}
