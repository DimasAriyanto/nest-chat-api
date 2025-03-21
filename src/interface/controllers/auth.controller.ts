import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { RegisterSchema } from '../../application/dto/register.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';
import { LoginSchema } from 'src/application/dto/login.dto';
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/refresh-token.use-case';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { LogoutUseCase } from 'src/application/use-cases/auth/logout.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('register')
  async register(@Body(new ZodValidationPipe(RegisterSchema)) data: any) {
    return this.registerUseCase.execute(data);
  }

  @Post('login')
  async login(@Body(new ZodValidationPipe(LoginSchema)) data: any) {
    return this.loginUseCase.execute(data);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Req() req: any) {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('Akses tidak diizinkan.');
    }

    return this.refreshTokenUseCase.execute(userId, body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.logoutUseCase.execute(userId);

    return { message: 'Logout berhasil.' };
  }
}
