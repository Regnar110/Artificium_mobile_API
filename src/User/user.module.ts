import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from 'src/lgcy/components/UserComponent/services/user.service';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { RedisModule } from 'src/shared/services/redis/redis.module';
import { ResponseBuilderService } from 'src/lgcy/domain/services/ResponseBuilder/responseBuilder.service';
import { User, UserSchema } from 'src/MongoDB/Schemas/user/user.schema';
import * as fs from 'fs';
import { AuthModule } from './auth/auth.module';
import { UserManagementModule } from './userManagement/userManagement.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    RedisModule,
    JwtModule.register({
      signOptions: { algorithm: 'RS256' },
      privateKey: fs.readFileSync('privateKey.pem')?.toString(),
      publicKey: fs.readFileSync('publicKey.pem')?.toString(),
    }),
    AuthModule,
    UserManagementModule,
  ],
  controllers: [],
  providers: [UsersService, BcryptService, ResponseBuilderService],
  exports: [UsersService],
})
export class UserModule {}
