import { Module } from '@nestjs/common';
import { RegisterUseCase } from '../use-cases/auth/register.use-case';
import { LoginUseCase } from '../use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '../use-cases/auth/refresh-token.use-case';
import { LogoutUseCase } from '../use-cases/auth/logout.use-case';
import { AuthService } from '../services/auth.service';
import { MongoModule } from 'src/infrastructure/database/mongo/mongo.module';
import { MongoUserRepository } from 'src/infrastructure/database/mongo/repositories/mongo-user.repository';
import { RedisRefreshTokenRepository } from 'src/infrastructure/database/redis/repositories/redis-refresh-token.repository';
import { CustomJwtModule } from 'src/infrastructure/authentication/jwt/jwt.module';
import { RedisModule } from 'src/infrastructure/database/redis/redis.module';
import { BcryptModule } from 'src/infrastructure/authentication/bcrypt/bcrypt.module';

@Module({
  imports: [MongoModule, CustomJwtModule, RedisModule, BcryptModule],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    AuthService,
    {
      provide: 'UserRepository',
      useClass: MongoUserRepository,
    },
    {
      provide: 'RefreshTokenRepository',
      useClass: RedisRefreshTokenRepository,
    },
  ],
  exports: [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    AuthService,
  ],
})
export class AuthModule {}
