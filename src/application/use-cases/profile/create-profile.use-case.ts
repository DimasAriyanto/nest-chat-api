import { Injectable, Inject } from '@nestjs/common';
import { ProfileRepository } from '../../../domain/repositories/profile-repository.interface';
import { CreateProfileDto } from '../../dto/create-profile.dto';
import { Profile } from '../../../domain/entities/profile.entity';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(data: CreateProfileDto): Promise<Profile> {
    const existingProfile = await this.profileRepository.getProfileByUserId(
      data.userId,
    );

    if (existingProfile) {
      throw new Error('Profile sudah ada.');
    }

    const zodiac = Profile.calculateZodiac(new Date(data.birthday));
    const horoscope = Profile.calculateHoroscope(new Date(data.birthday));

    const profile = new Profile(
      data.userId,
      data.name,
      data.gender,
      new Date(data.birthday),
      horoscope,
      zodiac,
      data.weight,
      data.height,
    );

    if (!profile.isValidBodyMetrics()) {
      throw new Error('Data tinggi atau berat badan tidak valid.');
    }

    return this.profileRepository.createProfile(profile);
  }
}
