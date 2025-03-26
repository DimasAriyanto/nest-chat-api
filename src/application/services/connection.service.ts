import { Inject, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConnectedClientsService } from './connected-clients.service';
import { MessageQueueService } from 'src/domain/services/message-queue-service.interface';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly connectedClientsService: ConnectedClientsService,
    @Inject('MessageQueueService')
    private readonly messageQueueService: MessageQueueService,
  ) {}

  async manageConnection(
    client: Socket,
    server: Server,
    userId: string,
  ): Promise<void> {
    const existingSocketId =
      await this.connectedClientsService.getClientIdByUserId(userId);

    if (existingSocketId) {
      server.sockets.sockets.get(existingSocketId)?.disconnect();
      await this.connectedClientsService.removeClient(existingSocketId);

      this.messageQueueService.unregisterUser(userId);
    }

    await this.connectedClientsService.addClient(client.id, userId);

    if (!this.messageQueueService.isUserRegistered(userId)) {
      this.messageQueueService.registerUserOnline(userId, (message) => {
        server.to(client.id).emit('receiveDirectMessage', message);
      });
    }
  }

  async removeClientConnection(
    clientId: string,
    server: Server,
  ): Promise<void> {
    const userId =
      (await this.connectedClientsService.getUserIdByClientId(clientId)) ||
      'unknown';

    this.messageQueueService.unregisterUser(userId);
    await this.connectedClientsService.removeClient(clientId);
  }
}
