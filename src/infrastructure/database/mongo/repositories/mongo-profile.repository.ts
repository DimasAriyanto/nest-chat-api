import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../schemas/profile.schema';
import { Profile as ProfileEntity } from '../../../../domain/entities/profile.entity';
import { ProfileRepository } from '../../../../domain/repositories/profile-repository.interface';

@Injectable()
export class MongoProfileRepository implements ProfileRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  private toDomain(profile: ProfileDocument): ProfileEntity {
    return new ProfileEntity(
      profile.userId,
      profile.name,
      profile.gender as 'male' | 'female' | 'other',
      profile.birthday,
      profile.horoscope,
      profile.zodiac,
      profile.weight,
      profile.height,
    );
  }

  async createProfile(
    profileData: Partial<ProfileEntity>,
  ): Promise<ProfileEntity> {
    const createdProfile = new this.profileModel(profileData);
    const savedProfile = await createdProfile.save();
    return this.toDomain(savedProfile);
  }

  async getProfileByUserId(userId: string): Promise<ProfileEntity | null> {
    const profile = await this.profileModel.findOne({ userId }).exec();
    return profile ? this.toDomain(profile) : null;
  }

  async updateProfile(
    userId: string,
    profileData: Partial<ProfileEntity>,
  ): Promise<ProfileEntity | null> {
    const updatedProfile = await this.profileModel
      .findOneAndUpdate({ userId }, { $set: profileData }, { new: true })
      .exec();

    return updatedProfile ? this.toDomain(updatedProfile) : null;
  }
}
