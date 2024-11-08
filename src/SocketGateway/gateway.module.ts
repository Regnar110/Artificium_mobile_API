import { Module } from '@nestjs/common';
import { RedisModule } from 'src/shared/services/redis/redis.module';
import { MainGateway } from './main.gateway';

@Module({
  imports: [RedisModule],
  providers: [MainGateway],
})
export class SocketGatewayModule {}
