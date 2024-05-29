import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from 'src/MongoDB/Schemas/user/user.schema';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import { ResponseBuilderService } from 'src/services/ResponseBuilder/responseBuilder.service';
import { RedisModule } from 'src/services/Redis/redis.module';

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
  providers: [UsersService, BcryptService, ResponseBuilderService],
  exports: [UsersService],
})
export class UserModule {}
