import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProfileUseCase } from '../../application/use-cases/profile/create-profile.use-case';
import { GetProfileUseCase } from '../../application/use-cases/profile/get-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/profile/update-profile.use-case';
import { JwtAuthGuard } from '../../infrastructure/authentication/guard/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Post('createProfile')
  async createProfile(@Req() req: any, @Body() body: any) {
    const data = { userId: req.user.id, ...body };
    return this.createProfileUseCase.execute(data);
  }

  @Get('getProfile')
  async getProfile(@Req() req: any) {
    const userId = req.user.id;
    return this.getProfileUseCase.execute(userId);
  }

  @Put('updateProfile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    const userId = req.user.id;
    return this.updateProfileUseCase.execute(userId, body);
  }
}
