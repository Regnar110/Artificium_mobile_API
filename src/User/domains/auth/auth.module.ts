import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserManagementModule } from '../userManagement/userManagement.module';
import { UserService } from '../userManagement/services/user.service';
import { ResponseBuilderService } from 'src/shared/services/ResponseBuilder/responseBuilder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/User/entities/user.entity';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { RedisService } from 'src/shared/services/redis/redis.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    ResponseBuilderService,
    JwtService,
    AuthService,
    UserService,
    BcryptService,
    RedisService,
  ],
})
export class AuthModule {}
