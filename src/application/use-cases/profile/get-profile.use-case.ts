import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from '../../../domain/repositories/profile-repository.interface';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(userId: string) {
    const profile = await this.profileRepository.getProfileByUserId(userId);

    if (!profile) {
      throw new NotFoundException('Profile tidak ditemukan.');
    }

    return profile;
  }
}
