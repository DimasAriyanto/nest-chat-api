import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  providers: [
    {
      provide: 'MessageQueueService',
      useClass: RabbitMQService,
    },
  ],
  exports: ['MessageQueueService'],
})
export class RabbitMQModule {}
