import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  verifyToken(token: string): Record<string, any> {
    return this.jwtService.verify(token);
  }
}
