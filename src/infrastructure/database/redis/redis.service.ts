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
}
