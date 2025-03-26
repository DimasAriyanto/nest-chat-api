import { Module } from '@nestjs/common';
import { ChatController } from '../controllers/chat.controller';
import { ChatGateway } from '../gateways/chat.gateway';
import { ChatModule } from 'src/application/modules/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [ChatController],
  providers: [ChatGateway],
})
export class ChatInterfaceModule {}
