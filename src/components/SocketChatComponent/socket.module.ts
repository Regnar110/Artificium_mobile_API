import { Module } from '@nestjs/common';
import { SocketChatGateway } from './socket.gateway';
import { RedisModule } from 'src/domain/services/Redis/redis.module';
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';

@Module({
  imports: [RedisModule],
  providers: [SocketChatGateway, AuthenticationService, ResponseBuilderService],
})
export class SocketChatModule {}