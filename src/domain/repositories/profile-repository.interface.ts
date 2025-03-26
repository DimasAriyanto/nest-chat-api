import { Profile } from '../entities/profile.entity';

export interface ProfileRepository {
  createProfile(profileData: Partial<Profile>): Promise<Profile>;
  getProfileByUserId(userId: string): Promise<Profile | null>;
  updateProfile(
    userId: string,
    profileData: Partial<Profile>,
  ): Promise<Profile | null>;
}
