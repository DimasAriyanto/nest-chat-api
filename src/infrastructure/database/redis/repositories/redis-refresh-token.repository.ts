import { Injectable } from '@nestjs/common';
import { RedisService } from '../service/redis.service';
import { RefreshTokenRepository } from '../../../../domain/repositories/refresh-token-repository.interface';

@Injectable()
export class RedisRefreshTokenRepository implements RefreshTokenRepository {
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private readonly redisService: RedisService) {}

  async saveToken(
    userId: string,
    refreshToken: string,
    expiresIn: number,
  ): Promise<void> {
    await this.redisService.client.set(
      `${this.REFRESH_TOKEN_KEY}:${userId}`,
      refreshToken,
      'EX',
      expiresIn,
    );
  }

  async getToken(userId: string): Promise<string | null> {
    return this.redisService.client.get(`${this.REFRESH_TOKEN_KEY}:${userId}`);
  }

  async removeToken(userId: string): Promise<void> {
    await this.redisService.client.del(`${this.REFRESH_TOKEN_KEY}:${userId}`);
  }
}
