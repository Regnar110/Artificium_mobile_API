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
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { RedisService } from 'src/domain/services/Redis/redis.service';
import { FriendListSocketEvents } from './friendListSocketEvents.service';
import { FRIEND_LIST_ON_EVENTS } from './constants';
type GatewayDefaultInterface = OnGatewayConnection & OnGatewayDisconnect;

@WebSocketGateway({
  namespace: 'friendList',
  cors: {
    origin: '*',
  },
})
export class SocketFriendListGateway implements GatewayDefaultInterface {
  constructor(
    private readonly redisService: RedisService,
    private readonly authenticationService: AuthenticationService,
    private readonly friendListSocketEvents: FriendListSocketEvents,
  ) {}
  async handleDisconnect(client: any) {
    console.log('FRIEND LIST NAMESPACE DISCONNECTED')
    try {
      const userToken = client.handshake.headers.authorization.split(' ')[1];
      const verifiedJWTPayload = this.authenticationService.verifyJWT(userToken);
      const socketIdConcatWithUserId = `${verifiedJWTPayload._id}_friendListSocket`;
      await this.redisService.removeKeyValuePair(socketIdConcatWithUserId);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async handleConnection(client: any) {
    console.log('HELO DUPA')
    
    try {
      const userToken = client.handshake.headers.authorization.split(' ')[1];
      if (!userToken) {
        // there is no Bearer token
        throw new UnauthorizedException();
      }

      const verifiedJWTPayload =
        this.authenticationService.verifyJWT(userToken);
      
        console.log('PLSODA')
        console.log(verifiedJWTPayload)

      if (!verifiedJWTPayload) {
        // Token is invalid
        throw new UnauthorizedException();
      }
      const socketIdConcatWithUserId = `${verifiedJWTPayload._id}_friendListSocket`;

      const isUserSessionPresentInRedis =
        await this.redisService.checkTokenPresence(verifiedJWTPayload._id);
      if (!isUserSessionPresentInRedis) {
        console.log('NO REDIS SESSIon')
        throw new UnauthorizedException();
      }

      await this.redisService.setKeyValuePair(
        socketIdConcatWithUserId,
        client.id,
      );
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
