import {
  Injectable,
  NestMiddleware,
  TooManyRequestsException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../../infrastructure/database/redis/redis.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly MAX_REQUESTS = 50;
  private readonly WINDOW_IN_SECONDS = 60;

  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress;

    const key = `rate_limit:${ip}`;
    const requests = await this.redisService.client.incr(key);

    if (requests === 1) {
      await this.redisService.client.expire(key, this.WINDOW_IN_SECONDS);
    }

    if (requests > this.MAX_REQUESTS) {
      throw new TooManyRequestsException(
        'Terlalu banyak permintaan. Coba lagi nanti.',
      );
    }

    next();
  }
}
