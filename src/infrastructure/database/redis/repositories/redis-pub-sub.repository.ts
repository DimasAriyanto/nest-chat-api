import { Injectable } from '@nestjs/common';
import { PubSubRepository } from 'src/domain/repositories/pub-sub-repository.interface';
import { RedisService } from 'src/infrastructure/database/redis/service/redis.service';

@Injectable()
export class RedisPubSubRepository implements PubSubRepository {
  constructor(private readonly redisService: RedisService) {}

  async publishMessage(channel: string, message: any): Promise<void> {
    await this.redisService.publish(channel, JSON.stringify(message));
  }

  async subscribeToMessages(
    channel: string,
    callback: (message: any) => void,
  ): Promise<void> {
    await this.redisService.subscribe(channel, (message) => {
      callback(JSON.parse(message));
    });
  }
}
