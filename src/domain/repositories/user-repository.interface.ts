import { User } from '../entities/user.entity';

export interface UserRepository {
  createUser(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  updateUserStatus(userId: string, status: string): Promise<void>;
}
