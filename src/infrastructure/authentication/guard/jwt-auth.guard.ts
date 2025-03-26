import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { TokenService } from '../../../domain/services/token-service.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('TokenService') private readonly jwtService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token tidak ditemukan.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verifyToken(token);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token tidak valid atau kadaluwarsa.');
    }
  }
}
