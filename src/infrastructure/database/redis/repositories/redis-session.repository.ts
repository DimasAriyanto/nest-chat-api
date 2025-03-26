import { Injectable } from '@nestjs/common';
import { RedisService } from '../service/redis.service';
import { SessionRepository } from '../../../../domain/repositories/session-repository.interface';

@Injectable()
export class RedisSessionRepository implements SessionRepository {
  private readonly SESSION_PREFIX = 'session:';

  constructor(private readonly redisService: RedisService) {}

  async createSession(
    userId: string,
    data: any,
    ttlSeconds: number = 3600,
  ): Promise<void> {
    const key = `${this.SESSION_PREFIX}${userId}`;
    await this.redisService.client.set(
      key,
      JSON.stringify(data),
      'EX',
      ttlSeconds,
    );
  }

  async getSession(userId: string): Promise<any | null> {
    const key = `${this.SESSION_PREFIX}${userId}`;
    const data = await this.redisService.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async removeSession(userId: string): Promise<void> {
    const key = `${this.SESSION_PREFIX}${userId}`;
    await this.redisService.client.del(key);
  }
}
