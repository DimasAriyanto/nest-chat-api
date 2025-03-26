import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from 'src/domain/services/token-service.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('TokenService') private readonly tokenService: TokenService,
  ) {}

  verifyToken(token: string | undefined): { id: string } | null {
    if (!token) return null;

    try {
      const payload = this.tokenService.verifyToken(token);
      return payload.id ? { id: payload.id } : null;
    } catch {
      return null;
    }
  }
}
