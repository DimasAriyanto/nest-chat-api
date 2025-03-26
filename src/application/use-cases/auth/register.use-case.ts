import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { HashService } from '../../../domain/services/hash-service.interface';
import { RegisterDto } from '../../dto/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('HashService') private readonly hashService: HashService,
  ) {}

  async execute(data: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await this.hashService.hash(data.password);
    const newUser = new User(null, data.username, data.email, hashedPassword);
    return this.userRepository.createUser(newUser);
  }
}
