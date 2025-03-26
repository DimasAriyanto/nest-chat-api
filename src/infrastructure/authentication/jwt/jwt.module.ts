import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from 'src/infrastructure/authentication/jwt/jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    {
      provide: 'TokenService',
      useClass: JwtService,
    },
  ],
  exports: ['TokenService', JwtModule],
})
export class CustomJwtModule {}
