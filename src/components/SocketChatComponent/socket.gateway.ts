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
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { RedisService } from 'src/domain/services/Redis/redis.service';

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
    private readonly redisService: RedisService,
    private readonly authenticationService: AuthenticationService,
  ) {}
  async handleConnection(client: any) {
    try {
      const userToken = client.handshake.headers.authorization.split(' ')[1];
      if (!userToken) {
        // there is no Bearer token
        throw new UnauthorizedException();
      }

      const verifiedJWTPayload =
        this.authenticationService.verifyJWT(userToken);

      if (!verifiedJWTPayload) {
        // Token is invalid
        throw new UnauthorizedException();
      }
      const socketIdConcatWithUserId = `${verifiedJWTPayload._id}_chatSocket`;

      const isUserSessionPresentInRedis =
        await this.redisService.checkTokenPresence(verifiedJWTPayload._id);
      if (!isUserSessionPresentInRedis) {
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
  handleDisconnect() {
    console.log('CHAT NAMESPACE DISCONNECTED');
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
