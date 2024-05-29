import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from './config';

@Injectable()
export class RedisService {
  private readonly RedisInstance: Redis;
  constructor() {
    console.log(redisConfig())
    this.RedisInstance = new Redis(redisConfig());
  }

  getInstance() {
    return this.RedisInstance;
  }
}
