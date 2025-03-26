import { Module } from '@nestjs/common';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileModule } from 'src/application/modules/profile.module';
import { CustomJwtModule } from 'src/infrastructure/authentication/jwt/jwt.module';

@Module({
  imports: [ProfileModule, CustomJwtModule],
  controllers: [ProfileController],
})
export class ProfileInterfaceModule {}
