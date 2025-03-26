import { ChatEntity } from '../entities/chat.entity';

export interface ChatRepository {
  createChat(chat: ChatEntity): Promise<ChatEntity>;
  getChatById(chatId: string): Promise<ChatEntity | null>;
  getChatByParticipants(participants: string[]): Promise<ChatEntity | null>;
  addParticipant(
    chatId: string,
    userId: string,
    role?: 'admin' | 'member',
  ): Promise<void>;
  getChatMembers(chatId: string): Promise<string[]>;
}
