import { Inject, Injectable } from '@nestjs/common';
import { MessageEntity } from '../../../domain/entities/message.entity';
import { MessageRepository } from '../../../domain/repositories/message-repository.interface';
import { MessageQueueService } from '../../../domain/services/message-queue-service.interface';
import { ChatRepository } from '../../../domain/repositories/chat-repository.interface';
import { MessageStatusRepository } from '../../../domain/repositories/message-status-repository.interface';
import { SendMessageDto, SendMessageSchema } from '../../dto/send-message.dto';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject('MessageRepository')
    private readonly messageRepository: MessageRepository,
    @Inject('ChatRepository')
    private readonly chatRepository: ChatRepository,
    @Inject('MessageStatusRepository')
    private readonly messageStatusRepository: MessageStatusRepository,
    @Inject('MessageQueueService')
    private readonly messageQueueService: MessageQueueService,
  ) {}

  async execute(data: SendMessageDto): Promise<MessageEntity> {
    const validatedData = SendMessageSchema.parse(data);

    const participants = await this.chatRepository.getChatMembers(
      validatedData.chatId,
    );

    const receiverId = participants.find(
      (participant) => participant !== validatedData.senderId,
    );

    if (!receiverId) {
      throw new Error('Receiver not found in the chat.');
    }

    const message = new MessageEntity(
      '',
      validatedData.chatId,
      validatedData.senderId,
      validatedData.content,
      validatedData.messageType,
      undefined,
      new Date(),
    );

    const savedMessage = await this.messageRepository.saveMessage(message);

    await this.messageStatusRepository.createMessageStatus({
      messageId: savedMessage.messageId,
      userId: validatedData.senderId,
      status: 'sent',
    });

    if (!this.messageQueueService.isUserRegistered(receiverId)) {
      await this.messageStatusRepository.createMessageStatus({
        messageId: savedMessage.messageId,
        userId: receiverId,
        status: 'delivered',
      });

      await this.messageQueueService.publishMessage({
        ...savedMessage,
        receiverId,
      });
    }

    return savedMessage;
  }
}
