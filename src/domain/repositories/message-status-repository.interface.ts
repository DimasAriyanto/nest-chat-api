import { MessageStatusEntity } from '../entities/message-status.entity';

export interface MessageStatusRepository {
  createMessageStatus(data: {
    messageId: string;
    userId: string;
    status: 'sent' | 'delivered' | 'read';
  }): Promise<void>;
  updateMessageStatus(
    messageId: string,
    userId: string,
    status: 'sent' | 'delivered' | 'read',
  ): Promise<void>;
  getMessageStatus(messageId: string): Promise<MessageStatusEntity[]>;
}
