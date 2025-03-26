import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  connect,
  ChannelWrapper,
  AmqpConnectionManager,
} from 'amqp-connection-manager';
import { MessageQueueService } from '../../../domain/services/message-queue-service.interface';

@Injectable()
export class RabbitMQService implements OnModuleInit, MessageQueueService {
  private connection: AmqpConnectionManager;
  private channelPublisher: ChannelWrapper;
  private channelConsumer: ChannelWrapper;
  private messageCallbacks: Map<string, (message: any) => void> = new Map();

  async onModuleInit() {
    this.connection = connect(
      [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      { reconnectTimeInSeconds: 5 },
    );

    this.channelPublisher = this.connection.createChannel({
      json: true,
      setup: (channel: any) =>
        channel.assertQueue('chat_queue', { durable: true }),
    });

    this.channelConsumer = this.connection.createChannel({
      json: true,
      setup: (channel: any) => {
        return Promise.all([
          channel.assertQueue('chat_queue', { durable: true }),
          channel.prefetch(1),
          channel.consume('chat_queue', (msg) => this.processMessage(msg)),
        ]);
      },
    });

    console.log('RabbitMQ connected with auto-reconnect enabled');
  }

  private async processMessage(msg: any) {
    if (!msg) {
      console.warn('Received empty message. Acknowledging to avoid retries.');
      return;
    }

    try {
      const message = JSON.parse(msg.content.toString());
      const { receiverId } = message;

      if (!receiverId) {
        console.warn('Received message without receiverId. Discarding.');
        this.channelConsumer.ack(msg);
        return;
      }

      const callback = this.messageCallbacks.get(receiverId);

      if (callback) {
        callback(message);
        this.channelConsumer.ack(msg);
        console.log(`Delivered queued message to user ${receiverId}`);
      } else {
        console.log(`User ${receiverId} still offline, requeuing message.`);
        this.channelConsumer.nack(msg, false, true);
      }
    } catch (error) {
      console.error('Error processing message from queue:', error);
      this.channelConsumer.ack(msg);
    }
  }

  async publishMessage(message: any): Promise<void> {
    if (!message || !message.receiverId) {
      console.warn('Invalid message. Skipping publish.');
      return;
    }

    await this.channelPublisher.sendToQueue('chat_queue', message, {
      persistent: true,
    });

    console.log(`📤 Published message to queue for ${message.receiverId}`);
  }

  registerUserOnline(userId: string, callback: (message: any) => void): void {
    if (this.messageCallbacks.has(userId)) {
      console.warn(
        `User ${userId} sudah terdaftar. Melewati registrasi ulang.`,
      );
      return;
    }

    this.messageCallbacks.set(userId, callback);
    console.log(`User ${userId} registered for message delivery.`);
  }

  unregisterUser(userId: string): void {
    if (this.messageCallbacks.has(userId)) {
      console.log(`Removing callback for user ${userId}`);
      this.messageCallbacks.delete(userId);
    }
    console.log(`User ${userId} unregistered from message delivery.`);
  }

  isUserRegistered(userId: string): boolean {
    return this.messageCallbacks.has(userId);
  }
}
