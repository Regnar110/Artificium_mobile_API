import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/modules/UserModule/user.service';
import UserRepo from '../utils/user.util';
import { User } from 'src/MongoDB/Schemas/user/user.schema';
import {
  SignInPayload,
  ProcessedSignInCredentials,
  RegisterPayload,
} from '../user.model';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('signin')
  async login(@Body() body: SignInPayload) {
    const x = await this.bcryptService.hashString(body.fields.password.value);
    console.log(x)
    const recievedUser = await this.usersService.getUser(
      UserRepo.extractFieldValue<ProcessedSignInCredentials>(body),
    );
    console.log(recievedUser);
  }

  @Post('register')
  register(@Body() body: RegisterPayload) {
    this.usersService.createUser(UserRepo.extractFieldValue<User>(body));
  }
}
