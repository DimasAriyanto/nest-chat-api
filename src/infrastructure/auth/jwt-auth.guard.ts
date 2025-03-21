import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { RefreshTokenRepository } from '../../infrastructure/repositories/refresh-token.repository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepo: RefreshTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token tidak ditemukan.');
    }

    const token = authHeader.split(' ')[1];

    const storedToken = await this.refreshTokenRepo.getToken(request.user.id);

    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Refresh token tidak valid.');
    }

    try {
      const decoded = this.jwtService.verifyToken(token);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token tidak valid atau kadaluwarsa.');
    }
  }
}
