import { Controller, Get, Param } from '@nestjs/common';
import { GetMessagesUseCase } from '../../application/use-cases/chat/get-messages.use-case';

@Controller('chat')
export class ChatController {
  constructor(private readonly getMessagesUseCase: GetMessagesUseCase) {}

  @Get(':chatId/messages')
  async getMessages(@Param('chatId') chatId: string) {
    return this.getMessagesUseCase.execute(chatId);
  }
}
