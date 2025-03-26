import { Inject, Injectable } from '@nestjs/common';
import { ConnectedClientsRepository } from 'src/domain/repositories/connected-clients-repository.interface';

@Injectable()
export class ConnectedClientsService {
  constructor(
    @Inject('ConnectedClientsRepository')
    private readonly connectedClientsRepository: ConnectedClientsRepository,
  ) {}

  async addClient(clientId: string, userId: string): Promise<void> {
    await this.connectedClientsRepository.addClient(clientId, userId);
  }

  async getClientIdByUserId(userId: string): Promise<string | null> {
    return this.connectedClientsRepository.getClientIdByUserId(userId);
  }

  async removeClient(clientId: string): Promise<void> {
    await this.connectedClientsRepository.removeClient(clientId);
  }

  async getUserIdByClientId(clientId: string): Promise<string | null> {
    return this.connectedClientsRepository.getUserIdByClientId(clientId);
  }
}
