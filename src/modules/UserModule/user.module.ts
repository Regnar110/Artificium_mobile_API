import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from 'src/MongoDB/Schemas/user/user.schema';
import { BcryptService } from 'src/domain/services/bcrypt/bcrypt.service';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';
import { RedisModule } from 'src/domain/services/Redis/redis.module';
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    RedisModule,
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
