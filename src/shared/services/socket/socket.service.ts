import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../../../lgcy/domain/services/Authentication/authentication.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SocketService {
  constructor(
    private readonly redisService: RedisService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async verifyAndConnect(client) {
    const userToken = client.handshake.headers.authorization.split(' ')[1];
    if (!userToken) {
      // there is no Bearer token
      throw new UnauthorizedException();
    }

    const verifiedJWTPayload = this.authenticationService.verifyJWT(userToken);
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
  }

  async disconnectUser(
    client: any,
    namespace: 'chatSocket' | 'friendListSocket',
  ) {
    const userToken = client.handshake.headers.authorization.split(' ')[1];
    const verifiedJWTPayload = this.authenticationService.verifyJWT(userToken);
    const socketIdConcatWithUserId = `${verifiedJWTPayload._id}_${namespace}`;
    await this.redisService.removeKeyValuePair(socketIdConcatWithUserId);
  }
}
