import { Module } from '@nestjs/common';
import { redisProviderFactory } from './redisFactory';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Module({
  providers: [Redis, RedisService, redisProviderFactory],
  exports: [RedisService],
})
export class RedisModule {}
