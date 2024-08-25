import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/MongoDB/Schemas/user/user.schema';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';
import { FriendListController } from '../controller/friendList/friendList.controller';
import { FriendListService } from '../services/friendList.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [FriendListController],
  providers: [ResponseBuilderService],
  exports: [FriendListService],
})
export class UserModule {}