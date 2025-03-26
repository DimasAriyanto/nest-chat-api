import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../domain/repositories/session-repository.interface';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async createUserSession(userId: string, data: any): Promise<void> {
    await this.sessionRepository.createSession(userId, data);
  }

  async getUserSession(userId: string): Promise<any | null> {
    return this.sessionRepository.getSession(userId);
  }

  async removeUserSession(userId: string): Promise<void> {
    await this.sessionRepository.removeSession(userId);
  }
}
