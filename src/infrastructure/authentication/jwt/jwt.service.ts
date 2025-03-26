import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { TokenService } from '../../../domain/services/token-service.interface';

@Injectable()
export class JwtService implements TokenService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  verifyToken(token: string): Record<string, any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw error;
    }
  }
}
