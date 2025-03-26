import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenRepository } from '../../../domain/repositories/refresh-token-repository.interface';
import { TokenService } from '../../../domain/services/token-service.interface';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('TokenService') private readonly jwtService: TokenService,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepo: RefreshTokenRepository,
  ) {}

  async execute(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const storedToken = await this.refreshTokenRepo.getToken(userId);

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException(
        'Refresh token tidak valid atau kadaluwarsa.',
      );
    }

    const newAccessToken = this.jwtService.generateAccessToken({ id: userId });

    return { accessToken: newAccessToken };
  }
}
