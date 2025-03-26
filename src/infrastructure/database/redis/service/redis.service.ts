import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times: any) => Math.min(times * 50, 2000),
    });

    this.client.on('connect', () => console.log('Redis Connected'));
    this.client.on('error', (err: any) => console.error('Redis Error:', err));
  }

  async onModuleInit() {
    try {
      await this.client.ping();
      console.log('Redis Connection Verified');
    } catch (error) {
      console.error('Redis Connection Failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('Redis Connection Closed');
  }

  async setHash(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, value);
  }

  async getHash(key: string, field: string): Promise<string | null> {
    return await this.client.hget(key, field);
  }

  async getHashAll(key: string): Promise<Record<string, string>> {
    return await this.client.hgetall(key);
  }

  async removeHash(key: string, field: string): Promise<void> {
    await this.client.hdel(key, field);
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.client.publish(channel, message);
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    const subscriber = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });

    subscriber.subscribe(channel);
    subscriber.on('message', (_, message) => callback(message));
  }
}
