import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MessageStatusDocument,
  MessageStatus,
} from '../schemas/message-status.schema';
import { MessageStatusEntity } from '../../../../domain/entities/message-status.entity';
import { MessageStatusRepository } from '../../../../domain/repositories/message-status-repository.interface';

@Injectable()
export class MongoMessageStatusRepository implements MessageStatusRepository {
  constructor(
    @InjectModel(MessageStatus.name)
    private readonly messageStatusModel: Model<MessageStatusDocument>,
  ) {}

  private toDomain(status: MessageStatusDocument): MessageStatusEntity {
    return new MessageStatusEntity(
      status._id.toString(),
      status.messageId,
      status.userId,
      status.status,
      status.updatedAt,
    );
  }

  async createMessageStatus(data: {
    messageId: string;
    userId: string;
    status: 'sent' | 'delivered' | 'read';
  }): Promise<void> {
    await this.messageStatusModel.create({
      messageId: data.messageId,
      userId: data.userId,
      status: data.status,
    });
  }

  async updateMessageStatus(
    messageId: string,
    userId: string,
    status: 'sent' | 'delivered' | 'read',
  ): Promise<void> {
    await this.messageStatusModel.findOneAndUpdate(
      { messageId, userId },
      { status, updatedAt: new Date() },
      { upsert: true },
    );
  }

  async getMessageStatus(messageId: string): Promise<MessageStatusEntity[]> {
    const statuses = await this.messageStatusModel.find({ messageId }).exec();
    return statuses.map(this.toDomain);
  }
}
