import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConnectedClientsService } from './connected-clients.service';
import { CreateChatUseCase } from '../use-cases/chat/create-chat.use-case';
import { SendMessageUseCase } from '../use-cases/chat/send-message.use-case';
import { HandleMessageDeliveryUseCase } from '../use-cases/chat/handle-message-delivery.use-case';
import { UpdateMessageStatusUseCase } from '../use-cases/chat/update-message-status.use-case';
import { MessageReadDTO } from '../dto/message-read.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly connectedClientsService: ConnectedClientsService,
    private readonly createChatUseCase: CreateChatUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly handleMessageDeliveryUseCase: HandleMessageDeliveryUseCase,
    private readonly updateMessageStatusUseCase: UpdateMessageStatusUseCase,
  ) {}

  async processDirectMessage(
    client: Socket,
    server: Server,
    data: any,
  ): Promise<void> {
    console.log(data);
    const userId = await this.connectedClientsService.getUserIdByClientId(
      client.id,
    );
    if (!userId) throw new Error('User not authenticated');

    const participants = [userId, data.receiverId];

    const chat = await this.createChatUseCase.execute({
      participants,
      createdBy: userId,
    });

    console.log(chat);

    const receiverId = await this.createChatUseCase.getReceiverId(
      chat.chatId,
      userId,
    );

    console.log(receiverId);

    if (!receiverId) throw new Error('Receiver not found in the chat.');

    const savedMessage = await this.sendMessageUseCase.execute({
      chatId: chat.chatId,
      senderId: userId,
      receiverId,
      content: data.content || '',
      messageType: data.messageType || 'text',
    });

    console.log(savedMessage);

    const receiverSocketId =
      await this.connectedClientsService.getClientIdByUserId(receiverId);

    console.log(receiverSocketId);

    await this.handleMessageDeliveryUseCase.execute({
      message: { ...savedMessage, receiverId },
      receiverSocketId,
      server,
    });

    console.log('Message delivered');

    client.emit('messageSent', savedMessage);
  }

  async markMessageAsRead(client: Socket, data: MessageReadDTO): Promise<void> {
    const userId = await this.connectedClientsService.getUserIdByClientId(
      client.id,
    );
    if (!userId) throw new Error('User not authenticated');

    await this.updateMessageStatusUseCase.markAsRead(data.messageId, userId);

    client.emit('messageRead', {
      messageId: data.messageId,
      status: 'read',
    });
  }
}
