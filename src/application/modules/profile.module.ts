import { Module } from '@nestjs/common';
import { CreateProfileUseCase } from 'src/application/use-cases/profile/create-profile.use-case';
import { GetProfileUseCase } from 'src/application/use-cases/profile/get-profile.use-case';
import { UpdateProfileUseCase } from 'src/application/use-cases/profile/update-profile.use-case';
import { MongoModule } from 'src/infrastructure/database/mongo/mongo.module';
import { MongoProfileRepository } from 'src/infrastructure/database/mongo/repositories/mongo-profile.repository';

@Module({
  imports: [MongoModule],
  providers: [
    CreateProfileUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    {
      provide: 'ProfileRepository',
      useClass: MongoProfileRepository,
    },
  ],
  exports: [CreateProfileUseCase, GetProfileUseCase, UpdateProfileUseCase],
})
export class ProfileModule {}
