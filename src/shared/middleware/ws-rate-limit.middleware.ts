import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RedisService } from '../../infrastructure/database/redis/service/redis.service';

@Injectable()
export class WsRateLimitService {
  constructor(
    private readonly redisService: RedisService,
    private readonly messageLimit = 10,
    private readonly timeWindow = 5,
  ) {}

  async isRateLimited(client: Socket): Promise<boolean> {
    const clientId = client.id;
    const key = `ws_rate_limit:${clientId}`;

    const requestCount = await this.redisService.client.incr(key);

    if (requestCount === 1) {
      await this.redisService.client.expire(key, this.timeWindow);
    }

    return requestCount > this.messageLimit;
  }
}
