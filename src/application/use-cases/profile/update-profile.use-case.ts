import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProfileRepository } from '../../../domain/repositories/profile-repository.interface';
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { Profile } from '../../../domain/entities/profile.entity';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    userId: string,
    updateData: UpdateProfileDto,
  ): Promise<Profile> {
    const existingProfile =
      await this.profileRepository.getProfileByUserId(userId);

    if (!existingProfile) {
      throw new NotFoundException('Profile tidak ditemukan.');
    }

    const updatedData: Partial<Profile> = {};

    if (updateData.name !== undefined) updatedData.name = updateData.name;
    if (updateData.gender !== undefined) updatedData.gender = updateData.gender;
    if (updateData.weight !== undefined) updatedData.weight = updateData.weight;
    if (updateData.height !== undefined) updatedData.height = updateData.height;

    if (updateData.birthday !== undefined) {
      const birthday =
        typeof updateData.birthday === 'string'
          ? new Date(updateData.birthday)
          : updateData.birthday;

      if (isNaN(birthday.getTime())) {
        throw new BadRequestException('Format tanggal lahir tidak valid.');
      }

      updatedData.birthday = birthday;
      updatedData.zodiac = Profile.calculateZodiac(birthday);
      updatedData.horoscope = Profile.calculateHoroscope(birthday);
    }

    const updatedProfile = await this.profileRepository.updateProfile(
      userId,
      updatedData,
    );

    if (!updatedProfile) {
      throw new BadRequestException('Gagal memperbarui profile.');
    }

    return updatedProfile;
  }
}
