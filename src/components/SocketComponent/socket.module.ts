import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RedisModule } from 'src/domain/services/Redis/redis.module';
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';

@Module({
  imports: [RedisModule],
  providers: [SocketGateway, AuthenticationService, ResponseBuilderService],
})
export class SocketModule {}
