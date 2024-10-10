import { UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FriendListSocketEvents } from './friendListSocketEvents.service';
import { FRIEND_LIST_ON_EVENTS } from './constants';
import { SocketService } from 'src/domain/services/SocketService/socket.service';
type GatewayDefaultInterface = OnGatewayConnection & OnGatewayDisconnect;

@WebSocketGateway({
  namespace: 'friendList',
  cors: {
    origin: '*',
  },
})
export class SocketFriendListGateway implements GatewayDefaultInterface {
  constructor(
    private readonly friendListSocketEvents: FriendListSocketEvents,
    private readonly socketService: SocketService,
  ) {}
  async handleDisconnect(client: any) {
    try {
      this.socketService.disconnectUser(client, 'friendListSocket');
    } catch {
      throw new UnauthorizedException();
    }
  }

  async handleConnection(client: any) {
    try {
      this.socketService.verifyAndConnect(client);
    } catch {
      // something failed
      throw new UnauthorizedException();
    }
  }

  @WebSocketServer()
  private server: Socket;

  @SubscribeMessage(FRIEND_LIST_ON_EVENTS.INVITE)
  async getFriendListInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    client.emit(
      FRIEND_LIST_ON_EVENTS.INVITE,
      await this.friendListSocketEvents.getInvitation(),
    );
  }

  @SubscribeMessage(FRIEND_LIST_ON_EVENTS.ACCEPT_INVITATION)
  async acceptFriendListInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    client.emit(
      FRIEND_LIST_ON_EVENTS.ACCEPT_INVITATION,
      await this.friendListSocketEvents.getInvitation(),
    );
  }

  @SubscribeMessage(FRIEND_LIST_ON_EVENTS.REJECT_INVITATION)
  async rejectFriendListInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    client.emit(
      FRIEND_LIST_ON_EVENTS.REJECT_INVITATION,
      await this.friendListSocketEvents.getInvitation(),
    );
  }
  // Implement other Socket.IO event handlers and message handlers
}
