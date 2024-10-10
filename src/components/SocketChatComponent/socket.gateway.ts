import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CHAT_ON_EVENTS } from './constants';
import { ChatSocketEvents } from './chatSocketEvents.service';
import { UnauthorizedException } from '@nestjs/common';
import { SocketService } from 'src/domain/services/SocketService/socket.service';

type GatewayDefaultInterface = OnGatewayConnection & OnGatewayDisconnect;

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class SocketChatGateway implements GatewayDefaultInterface {
  constructor(
    private readonly chatSocketEvents: ChatSocketEvents,
    private readonly socketService: SocketService,
  ) {}
  async handleConnection(client: any) {
    try {
      this.socketService.verifyAndConnect(client);
    } catch {
      throw new UnauthorizedException();
    }
  }
  handleDisconnect(client) {
    console.log('CHAT NAMESPACE DISCONNECTED');
    try {
      this.socketService.disconnectUser(client, 'chatSocket');
    } catch {
      throw new UnauthorizedException();
    }
  }

  @SubscribeMessage(CHAT_ON_EVENTS.SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    console.log('event')
    client.emit(
      CHAT_ON_EVENTS.SEND_MESSAGE,
      await this.chatSocketEvents.sendMessage(data),
    );
  }
  @WebSocketServer()
  private server: Socket;
  // Implement other Socket.IO event handlers and message handlers
}
