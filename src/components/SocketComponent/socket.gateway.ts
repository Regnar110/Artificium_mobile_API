import { UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { RedisService } from 'src/domain/services/Redis/redis.service';
type GatewayDefaultInterface = OnGatewayConnection & OnGatewayDisconnect;

@WebSocketGateway({
  namespace: 'entry',
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements GatewayDefaultInterface {
  constructor(
    private readonly redisService: RedisService,
    private readonly authenticationService: AuthenticationService,
  ) {}
  async handleDisconnect(client: any) {
    try {
      const userToken = client.handshake.headers.authorization.split(' ')[1];

      const verifiedJWTPayload = this.authenticationService.verifyJWT(userToken);
      const socketIdConcatWithUserId = `${verifiedJWTPayload._id}_socket`;
      await this.redisService.removeKeyValuePair(socketIdConcatWithUserId);
    } catch {
      throw new UnauthorizedException();
    }
  }

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
      const socketIdConcatWithUserId = `${verifiedJWTPayload._id}_socket`;

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

  @WebSocketServer()
  private server: Socket;

  @SubscribeMessage('hello')
  handleEvent(@MessageBody() data: any) {
    console.log('x')
  }
  // Implement other Socket.IO event handlers and message handlers
}
