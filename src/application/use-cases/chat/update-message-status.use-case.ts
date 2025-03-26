import { Inject, Injectable } from '@nestjs/common';
import { MessageStatusRepository } from '../../../domain/repositories/message-status-repository.interface';

@Injectable()
export class UpdateMessageStatusUseCase {
  constructor(
    @Inject('MessageStatusRepository')
    private readonly messageStatusRepository: MessageStatusRepository,
  ) {}

  async markAsDelivered(messageId: string, userId: string): Promise<void> {
    await this.messageStatusRepository.updateMessageStatus(
      messageId,
      userId,
      'delivered',
    );
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    await this.messageStatusRepository.updateMessageStatus(
      messageId,
      userId,
      'read',
    );
  }
}
