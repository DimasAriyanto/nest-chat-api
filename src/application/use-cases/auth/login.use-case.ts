import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user-repository.interface';
import { TokenService } from '../../../domain/services/token-service.interface';
import { RefreshTokenRepository } from '../../../domain/repositories/refresh-token-repository.interface';
import { HashService } from '../../../domain/services/hash-service.interface';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('TokenService') private readonly jwtService: TokenService,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepo: RefreshTokenRepository,
    @Inject('HashService') private readonly hashService: HashService,
  ) {}

  async execute(
    data: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const isPasswordValid = await this.hashService.compare(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const accessToken = this.jwtService.generateAccessToken({ id: user.id });
    const refreshToken = this.jwtService.generateRefreshToken({ id: user.id });

    await this.refreshTokenRepo.saveToken(user.id, refreshToken, 604800);

    return { accessToken, refreshToken };
  }
}
