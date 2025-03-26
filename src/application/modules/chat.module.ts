import { Module } from '@nestjs/common';
import { MongoModule } from 'src/infrastructure/database/mongo/mongo.module';
import { CustomJwtModule } from 'src/infrastructure/authentication/jwt/jwt.module';
import { RedisModule } from 'src/infrastructure/database/redis/redis.module';
import { RabbitMQModule } from 'src/infrastructure/message-broker/rabbitmq/rabbitmq.module';

import { SendMessageUseCase } from 'src/application/use-cases/chat/send-message.use-case';
import { CreateChatUseCase } from 'src/application/use-cases/chat/create-chat.use-case';
import { GetMessagesUseCase } from 'src/application/use-cases/chat/get-messages.use-case';
import { UpdateMessageStatusUseCase } from 'src/application/use-cases/chat/update-message-status.use-case';
import { HandleMessageDeliveryUseCase } from 'src/application/use-cases/chat/handle-message-delivery.use-case';

import { MongoMessageRepository } from 'src/infrastructure/database/mongo/repositories/mongo-message.repository';
import { MongoChatRepository } from 'src/infrastructure/database/mongo/repositories/mongo-chat.repository';
import { MongoMessageStatusRepository } from 'src/infrastructure/database/mongo/repositories/mongo-message-status.repository';

import { ConnectedClientsService } from 'src/application/services/connected-clients.service';
import { ConnectionService } from 'src/application/services/connection.service';
import { MessageService } from 'src/application/services/message.service';
import { RedisConnectedClientsRepository } from 'src/infrastructure/database/redis/repositories/redis-connected-clients.repository';
import { RedisPubSubRepository } from 'src/infrastructure/database/redis/repositories/redis-pub-sub.repository';
import { RedisSessionRepository } from 'src/infrastructure/database/redis/repositories/redis-session.repository';
import { AuthService } from 'src/application/services/auth.service';

@Module({
  imports: [MongoModule, CustomJwtModule, RedisModule, RabbitMQModule],
  providers: [
    SendMessageUseCase,
    CreateChatUseCase,
    GetMessagesUseCase,
    UpdateMessageStatusUseCase,
    HandleMessageDeliveryUseCase,
    {
      provide: 'MessageRepository',
      useClass: MongoMessageRepository,
    },
    {
      provide: 'ChatRepository',
      useClass: MongoChatRepository,
    },
    {
      provide: 'MessageStatusRepository',
      useClass: MongoMessageStatusRepository,
    },
    {
      provide: 'ConnectedClientsRepository',
      useClass: RedisConnectedClientsRepository,
    },
    {
      provide: 'PubSubRepository',
      useClass: RedisPubSubRepository,
    },
    {
      provide: 'SessionRepository',
      useClass: RedisSessionRepository,
    },
    ConnectedClientsService,
    ConnectionService,
    MessageService,
    AuthService,
  ],
  exports: [
    SendMessageUseCase,
    CreateChatUseCase,
    GetMessagesUseCase,
    UpdateMessageStatusUseCase,
    HandleMessageDeliveryUseCase,
    ConnectionService,
    MessageService,
    AuthService,
  ],
})
export class ChatModule {}
