import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RedisService } from '../../infrastructure/database/redis/service/redis.service';

@Injectable()
export class HttpRateLimitMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket?.remoteAddress;
    const key = `rate_limit:${ip}`;

    const requestCount = await this.redisService.client.incr(key);

    if (requestCount === 1) {
      await this.redisService.client.expire(key, 60);
    }

    if (requestCount > 20) {
      throw new HttpException(
        'Terlalu banyak request, coba lagi nanti.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }
}
