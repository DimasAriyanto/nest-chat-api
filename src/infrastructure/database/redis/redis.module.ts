import { Module } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/database/redis/service/redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
