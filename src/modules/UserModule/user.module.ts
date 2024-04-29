import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
} from 'src/MongoDB/Schemas/registered_user/user.schema';
import { UsersService } from './user.service';
import { RegisterController } from 'src/controllers/HubPage/register/register.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [RegisterController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
