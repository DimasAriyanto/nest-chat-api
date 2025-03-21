import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../../../infrastructure/repositories/refresh-token.repository';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly refreshTokenRepo: RefreshTokenRepository) {}

  async execute(userId: string): Promise<void> {
    await this.refreshTokenRepo.removeToken(userId);
  }
}
