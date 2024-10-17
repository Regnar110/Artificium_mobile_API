import { Module } from '@nestjs/common';
import { SocketChatGateway } from './socket.gateway';
import { RedisModule } from 'src/shared/services/redis/redis.module';
import { AuthenticationService } from 'src/lgcy/domain/services/Authentication/authentication.service';
import { ResponseBuilderService } from 'src/lgcy/domain/services/ResponseBuilder/responseBuilder.service';
import { ChatSocketEvents } from './chatSocketEvents.service';
import { SocketService } from 'src/shared/services/socket/socket.service';

@Module({
  imports: [RedisModule],
  providers: [
    SocketChatGateway,
    AuthenticationService,
    ResponseBuilderService,
    ChatSocketEvents,
    SocketService,
  ],
})
export class SocketChatModule {}
