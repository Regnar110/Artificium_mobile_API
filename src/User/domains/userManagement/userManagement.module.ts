import { Module } from '@nestjs/common';
import { UserManagementController } from './presentation/controllers/userManagement.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/User/entities/user.entity';
import { ResponseBuilderService } from 'src/shared/services/ResponseBuilder/responseBuilder.service';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { RedisService } from 'src/shared/services/redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserManagementController],
  providers: [UserService, ResponseBuilderService, BcryptService, RedisService],
})
export class UserManagementModule {}
