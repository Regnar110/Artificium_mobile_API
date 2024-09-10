import { Module } from '@nestjs/common';
import { SocketFriendListGateway } from './socket.gateway';
import { RedisModule } from 'src/domain/services/Redis/redis.module';
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';
import { FriendListSocketEvents } from '../FriendListSocketComponent/friendListSocketEvents.service';

@Module({
  imports: [RedisModule],
  providers: [
    SocketFriendListGateway,
    AuthenticationService,
    ResponseBuilderService,
    FriendListSocketEvents,
  ],
})
export class SocketFriendListModule {}
