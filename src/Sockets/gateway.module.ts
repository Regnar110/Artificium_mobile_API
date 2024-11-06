import { Module } from '@nestjs/common';
import { RedisModule } from 'src/shared/services/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [],
})
export class SocketGatewayModule {}
