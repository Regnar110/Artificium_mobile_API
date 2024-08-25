import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from './config';
import { ObjectId } from 'mongoose';

@Injectable()
export class RedisService {
  private readonly RedisInstance: Redis;
  constructor() {
    this.RedisInstance = new Redis(redisConfig());
  }

  getInstance() {
    return this.RedisInstance;
  }

  async setAccessToken(key: ObjectId, value: string) {
    await this.RedisInstance.set(key.toString(), value, 'EX', 21600);
  }

  async removeAccessToken(key: ObjectId) {
    return await this.RedisInstance.del(key.toString());
  }

  async checkTokenPresence(key: ObjectId) {
    return await this.RedisInstance.get(key.toString());
  }
}
