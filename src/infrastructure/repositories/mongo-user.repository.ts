import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from '../database/schemas/user.schema'; // ✅ Ubah import ke schema
import { User as DomainUser } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // ✅ Gunakan User dari schema, bukan entitas domain
  ) {}

  private toDomain(user: UserDocument): DomainUser {
    return new DomainUser(
      user._id.toString(),
      user.username,
      user.email,
      user.password,
      user.status as 'online' | 'offline',
      user.last_seen,
    );
  }

  async createUser(user: DomainUser): Promise<DomainUser> {
    const createdUser = new this.userModel({ ...user, _id: undefined });
    const savedUser = await createdUser.save();
    return this.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? this.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<DomainUser | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user ? this.toDomain(user) : null;
  }
}
