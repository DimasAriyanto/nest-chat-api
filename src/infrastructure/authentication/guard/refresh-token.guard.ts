import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { TokenService } from '../../../domain/services/token-service.interface';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @Inject('TokenService') private readonly jwtService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token tidak ditemukan.');
    }

    try {
      const decoded = this.jwtService.verifyToken(body.refreshToken);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException(
        'Refresh token tidak valid atau kadaluwarsa.',
      );
    }
  }
}
