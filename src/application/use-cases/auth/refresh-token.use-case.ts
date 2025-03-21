import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenRepository } from '../../../infrastructure/repositories/refresh-token.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly jwtService: JwtService,
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
