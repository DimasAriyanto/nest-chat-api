import { Inject, Injectable } from '@nestjs/common';
import { MessageQueueService } from '../../../domain/services/message-queue-service.interface';
import { UpdateMessageStatusUseCase } from './update-message-status.use-case';
import {
  HandleMessageDeliveryDto,
  HandleMessageDeliverySchema,
} from '../../dto/handle-message-delivery.dto';

@Injectable()
export class HandleMessageDeliveryUseCase {
  constructor(
    @Inject('MessageQueueService')
    private readonly messageQueueService: MessageQueueService,
    private readonly updateMessageStatusUseCase: UpdateMessageStatusUseCase,
  ) {}

  async execute(data: HandleMessageDeliveryDto): Promise<void> {
    const validatedData = HandleMessageDeliverySchema.parse(data);

    const { message, receiverSocketId, server } = validatedData;

    if (receiverSocketId) {
      server.to(receiverSocketId).emit('receiveDirectMessage', message);

      await this.updateMessageStatusUseCase.markAsDelivered(
        message.messageId,
        message.receiverId,
      );
    } else {
      await this.messageQueueService.publishMessage(message);

      await this.updateMessageStatusUseCase.markAsDelivered(
        message.messageId,
        message.receiverId,
      );
    }
  }
}
