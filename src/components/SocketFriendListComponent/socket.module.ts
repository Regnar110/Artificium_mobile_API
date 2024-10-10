import { Module } from '@nestjs/common';
import { SocketFriendListGateway } from './socket.gateway';
import { RedisModule } from 'src/domain/services/Redis/redis.module';
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';
import { FriendListSocketEvents } from './friendListSocketEvents.service';
import { SocketService } from 'src/domain/services/SocketService/socket.service';

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
