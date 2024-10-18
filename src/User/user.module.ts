import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { RedisModule } from 'src/shared/services/redis/redis.module';
import { ResponseBuilderService } from 'src/lgcy/domain/services/ResponseBuilder/responseBuilder.service';
import { User, UserSchema } from 'src/MongoDB/Schemas/user/user.schema';
import * as fs from 'fs';
import { AuthModule } from './domains/auth/auth.module';
import { UserManagementModule } from './domains/userManagement/userManagement.module';
import { AuthController } from './domains/auth/presentation/controllers/auth.controller';
import { UserManagementController } from './domains/userManagement/presentation/controllers/userManagement.controller';
import { UserService } from './domains/userManagement/services/user.service';
import { RedisService } from 'src/shared/services/redis/redis.service';
import { AuthService } from './domains/auth/services/auth.service';

@Module({
  imports: [RedisModule, AuthModule, UserManagementModule],
  controllers: [],
  providers: [],
})
export class UserModule {}
