import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ConnectionService } from 'src/application/services/connection.service';
import { MessageService } from 'src/application/services/message.service';
import { AuthService } from 'src/application/services/auth.service';

import { SendMessageSchema } from 'src/application/dto/send-message.dto';
import { MessageReadSchema } from 'src/application/dto/message-read.dto';

import { ErrorHandlingFilter } from 'src/shared/middleware/error-handling.filter';
import { EventTypes } from 'src/shared/constants/event-types';
import { Inject, UseFilters } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
  path: '/socket.io/',
})
@UseFilters(ErrorHandlingFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly messageService: MessageService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  // 🔹 Handle WebSocket Connection
  async handleConnection(client: Socket) {
    const decoded = this.authService.verifyToken(
      client.handshake.query?.token as string,
    );
    if (!decoded) return client.disconnect();

    await this.connectionService.manageConnection(
      client,
      this.server,
      decoded.id,
    );

    client.emit(EventTypes.CONNECTED, { userId: decoded.id });
  }

  // 🔹 Handle WebSocket Disconnection
  async handleDisconnect(client: Socket) {
    await this.connectionService.removeClientConnection(client.id, this.server);
  }

  // 🔹 Ping-Pong Heartbeat Check
  @SubscribeMessage(EventTypes.PING)
  handlePing(@ConnectedSocket() client: Socket) {
    return {
      event: EventTypes.PONG,
      data: { timestamp: new Date().toISOString() },
    };
  }

  // 🔹 Handle Direct Message
  @SubscribeMessage(EventTypes.SEND_MESSAGE)
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      await this.messageService.processDirectMessage(client, this.server, data);
    } catch (error) {
      client.emit(EventTypes.ERROR, {
        message: 'Invalid message data',
        error: error.message,
      });
    }
  }

  // 🔹 Handle Message Read Acknowledgment
  @SubscribeMessage(EventTypes.MESSAGE_READ)
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: unknown,
  ) {
    try {
      const validatedData = MessageReadSchema.parse(data);
      await this.messageService.markMessageAsRead(client, validatedData);
    } catch (error) {
      client.emit(EventTypes.ERROR, {
        message: 'Invalid read data',
        error: error.message,
      });
    }
  }
}
