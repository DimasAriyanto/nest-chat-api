import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthModule } from 'src/application/modules/auth.module';
import { CustomJwtModule } from 'src/infrastructure/authentication/jwt/jwt.module';
import { RefreshTokenGuard } from 'src/infrastructure/authentication/guard/refresh-token.guard';
import { JwtAuthGuard } from 'src/infrastructure/authentication/guard/jwt-auth.guard';

@Module({
  imports: [AuthModule, CustomJwtModule],
  controllers: [AuthController],
  providers: [RefreshTokenGuard, JwtAuthGuard],
})
export class AuthInterfaceModule {}
