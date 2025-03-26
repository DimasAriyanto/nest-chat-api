import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../../../domain/repositories/refresh-token-repository.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepo: RefreshTokenRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.refreshTokenRepo.removeToken(userId);
  }
}
