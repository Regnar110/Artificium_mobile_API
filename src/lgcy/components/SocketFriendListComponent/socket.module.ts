import { Module } from '@nestjs/common';
import { SocketFriendListGateway } from './socket.gateway';
import { RedisModule } from 'src/shared/services/redis/redis.module';
import { AuthenticationService } from 'src/lgcy/domain/services/Authentication/authentication.service';
import { ResponseBuilderService } from 'src/lgcy/domain/services/ResponseBuilder/responseBuilder.service';
import { FriendListSocketEvents } from './friendListSocketEvents.service';
import { SocketService } from 'src/shared/services/socket/socket.service';

@Module({
  imports: [RedisModule],
  providers: [
    SocketFriendListGateway,
    AuthenticationService,
    ResponseBuilderService,
    FriendListSocketEvents,
    SocketService,
  ],
})
export class SocketFriendListModule {}
