import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

export const redisProviderFactory: FactoryProvider<Redis> = {
  provide: 'RedisService',
  useFactory: (redisProvider: RedisService) => {
    console.log(redisProvider.getInstance());
	return redisProvider.getInstance();
  },
  inject: [RedisService],
};
