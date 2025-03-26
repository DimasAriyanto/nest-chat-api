import { MessageEntity } from '../entities/message.entity';

export interface MessageRepository {
  saveMessage(message: MessageEntity): Promise<MessageEntity>;
  getMessagesByChatId(chatId: string): Promise<MessageEntity[]>;
  getMessageById(messageId: string): Promise<MessageEntity | null>;
}
