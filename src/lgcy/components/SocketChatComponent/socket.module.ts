import { Module } from '@nestjs/common';
import { SocketChatGateway } from './socket.gateway';
import { RedisModule } from 'src/shared/services/redis/redis.module';
import { ChatSocketEvents } from './chatSocketEvents.service';
import { SocketService } from 'src/shared/services/socket/socket.service';
import { AuthService } from 'src/User/domains/auth/services/auth.service';

@Module({
  imports: [RedisModule],
  providers: [SocketChatGateway, AuthService, ChatSocketEvents, SocketService],
})
export class SocketChatModule {}
