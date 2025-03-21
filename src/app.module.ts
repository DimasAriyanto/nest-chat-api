import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RegisterUseCase } from './application/use-cases/auth/register.use-case';
import { AuthController } from './interface/controllers/auth.controller';
import { MongoUserRepository } from './infrastructure/repositories/mongo-user.repository';
import { LoginUseCase } from './application/use-cases/auth/login.use-case';
import { JwtService } from './infrastructure/auth/jwt.service';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { RedisService } from './infrastructure/database/redis/redis.service';
import {
  User,
  UserSchema,
} from './infrastructure/database/schemas/user.schema';
import { RefreshTokenRepository } from './infrastructure/repositories/refresh-token.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get<string>('MONGO_URL')}`,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    MongoUserRepository,
    RedisService,
    JwtService,
    RefreshTokenRepository,
    RegisterUseCase,
    LoginUseCase,
    JwtAuthGuard,
    { provide: 'UserRepository', useClass: MongoUserRepository },
  ],
})
export class AppModule {}
