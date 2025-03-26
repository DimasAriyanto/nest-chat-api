import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ErrorHandlingFilter } from './shared/middleware/error-handling.filter';
import { APP_FILTER } from '@nestjs/core';
import { HttpRateLimitMiddleware } from './shared/middleware/http-rate-limit.middleware';
import { AuthInterfaceModule } from './interface/modules/auth.module';
import { RedisModule } from './infrastructure/database/redis/redis.module';
import { ProfileInterfaceModule } from './interface/modules/profile.module';
import { ChatInterfaceModule } from './interface/modules/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    AuthInterfaceModule,
    ProfileInterfaceModule,
    ChatInterfaceModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHandlingFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRateLimitMiddleware).forRoutes('*');
  }
}
