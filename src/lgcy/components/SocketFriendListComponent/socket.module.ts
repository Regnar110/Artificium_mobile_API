import { Module } from '@nestjs/common';
import { SocketFriendListGateway } from './socket.gateway';
import { RedisModule } from 'src/shared/services/redis/redis.module';
import { FriendListSocketEvents } from './friendListSocketEvents.service';
import { SocketService } from 'src/shared/services/socket/socket.service';
import { ResponseBuilderService } from 'src/shared/services/ResponseBuilder/responseBuilder.service';
import { AuthService } from 'src/User/domains/auth/services/auth.service';

@Module({
  imports: [RedisModule],
  providers: [
    SocketFriendListGateway,
    AuthService,
    ResponseBuilderService,
    FriendListSocketEvents,
    SocketService,
  ],
})
export class SocketFriendListModule {}
