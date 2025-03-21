import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { RefreshTokenRepository } from '../../../infrastructure/repositories/refresh-token.repository';
import { LoginDto } from '../../dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepo: RefreshTokenRepository,
  ) {}

  async execute(
    data: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const accessToken = this.jwtService.generateAccessToken({ id: user.id });
    const refreshToken = this.jwtService.generateRefreshToken({ id: user.id });

    await this.refreshTokenRepo.saveToken(user.id, refreshToken, 604800);

    return { accessToken, refreshToken };
  }
}
