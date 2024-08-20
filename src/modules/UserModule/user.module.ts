import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from 'src/MongoDB/Schemas/user/user.schema';
import { BcryptService } from 'src/domain/services/bcrypt/bcrypt.service';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';
import { RedisModule } from 'src/domain/services/Redis/redis.module';
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';

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
      secret: process.env.JWT_SECRET,
      privateKey: fs.readFileSync('privateKey.pem')?.toString(),
      publicKey: fs.readFileSync('publicKey.pem')?.toString(),
    }),
  ],
  controllers: [UserController],
  providers: [
    UsersService,
    BcryptService,
    ResponseBuilderService,
    AuthenticationService,
  ],
  exports: [UsersService],
})
export class UserModule {}
