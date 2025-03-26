import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashService } from '../../../domain/services/hash-service.interface';

@Injectable()
export class BcryptService implements HashService {
  private readonly SALT_ROUNDS = 10;

  async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedText);
  }
}
