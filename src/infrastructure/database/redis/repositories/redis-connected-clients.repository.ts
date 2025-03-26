import { Injectable } from '@nestjs/common';
import { ConnectedClientsRepository } from 'src/domain/repositories/connected-clients-repository.interface';
import { RedisService } from 'src/infrastructure/database/redis/service/redis.service';

@Injectable()
export class RedisConnectedClientsRepository
  implements ConnectedClientsRepository
{
  private readonly CLIENTS_KEY = 'connectedClients';

  constructor(private readonly redisService: RedisService) {}

  async addClient(clientId: string, userId: string): Promise<void> {
    await this.redisService.setHash(this.CLIENTS_KEY, clientId, userId);
  }

  async getClientIdByUserId(userId: string): Promise<string | null> {
    const clients = await this.redisService.getHashAll(this.CLIENTS_KEY);
    return (
      Object.keys(clients).find((clientId) => clients[clientId] === userId) ||
      null
    );
  }

  async removeClient(clientId: string): Promise<void> {
    await this.redisService.removeHash(this.CLIENTS_KEY, clientId);
  }

  async getUserIdByClientId(clientId: string): Promise<string | null> {
    return this.redisService.getHash(this.CLIENTS_KEY, clientId);
  }
}
