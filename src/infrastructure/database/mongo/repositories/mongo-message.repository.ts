import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDocument, Message } from '../schemas/message.schema';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { MessageRepository } from '../../../../domain/repositories/message-repository.interface';

@Injectable()
export class MongoMessageRepository implements MessageRepository {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  private toDomain(message: MessageDocument): MessageEntity {
    return new MessageEntity(
      message._id.toString(),
      message.chatId,
      message.senderId,
      message.content,
      message.messageType,
      message.attachmentUrl,
      message.createdAt,
    );
  }

  async saveMessage(message: MessageEntity): Promise<MessageEntity> {
    const createdMessage = await this.messageModel.create(message);
    return this.toDomain(createdMessage);
  }

  async getMessagesByChatId(chatId: string): Promise<MessageEntity[]> {
    const messages = await this.messageModel.find({ chatId }).exec();
    return messages.map(this.toDomain);
  }

  async getMessageById(messageId: string): Promise<MessageEntity | null> {
    const message = await this.messageModel.findById(messageId).exec();
    return message ? this.toDomain(message) : null;
  }
}
