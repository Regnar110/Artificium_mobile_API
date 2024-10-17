import { Module } from '@nestjs/common';
import { UserManagementController } from './presentation/controllers/userManagement.controller';
import { CreateUserService } from './services/createUser.service';

@Module({
  imports: [],
  controllers: [UserManagementController],
  providers: [CreateUserService],
})
export class UserManagementModule {}
