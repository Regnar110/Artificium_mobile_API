import { Module } from '@nestjs/common';
import { RedisModule } from 'src/shared/services/redis/redis.module';
import { AuthModule } from './domains/auth/auth.module';
import { UserManagementModule } from './domains/userManagement/userManagement.module';

@Module({
  imports: [RedisModule, AuthModule, UserManagementModule],
  controllers: [],
  providers: [],
})
export class UserModule {}
