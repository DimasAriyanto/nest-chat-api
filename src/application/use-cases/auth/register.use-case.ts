import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../dto/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(data: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User(null, data.username, data.email, hashedPassword);
    return this.userRepository.createUser(newUser);
  }
}
