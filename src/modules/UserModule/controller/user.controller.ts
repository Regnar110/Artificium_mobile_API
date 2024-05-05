import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
  @HttpCode(200)
  async login(@Body() body: SignInPayload) {
    const recievedUser = await this.usersService.getUser(
      UserRepo.extractFieldValue<ProcessedSignInCredentials>(body),
    );
    console.log(recievedUser);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterPayload, @Res() res: Response) {
    const userWithEmailExist = await this.usersService.findUserWithEmail({
      email: body.fields.email.value,
    });

    if (userWithEmailExist) return;

    body.fields.password.value = await this.bcryptService.hashString(
      body.fields.password.value,
    );
    const x = await this.usersService.createUser(
      UserRepo.extractFieldValue<User>(body),
    );
    
    console.log(x)
    res.status(HttpStatus.CREATED).send({ x: 1 });
  }
}
