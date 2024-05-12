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
import { ResponseBuilderService } from 'src/services/ResponseBuilder/responseBuilder.service';
import { REDIRECT } from 'src/services/ResponseBuilder/redirectors.constant';
import { TryCatch } from '../utils/TryCatchDecorator';
import { UserResponses } from './responses';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly responseBuilder: ResponseBuilderService,
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
  @TryCatch()
  async register(@Body() body: RegisterPayload, @Res() res: Response) {
    const userWithEmailExist = await this.usersService.findUserWithEmail({
      email: body.fields.email.value,
    });
    console.log(body)

    if (userWithEmailExist) {
      const response = this.responseBuilder.buildStandardResponse(
        UserResponses.register.emailExist,
      );
      return res.status(response.status).json(response);
    }

    body.fields.password.value = await this.bcryptService.hashString(
      body.fields.password.value,
    );

    const createdUser = await this.usersService.createUser(
      UserRepo.extractFieldValue<User>(body),
    );

    if ('email' in createdUser) {
      const response = this.responseBuilder.buildStandardResponse<{
        clientMessage: string;
      }>(UserResponses.register.userCreated);
      return res.status(response.status).json(response);
    } else {
      const response = this.responseBuilder.buildStandardResponse<{
        clientMessage: string;
      }>(UserResponses.register.userNotCreated);
      return res.status(response.status).json(response);
    }
  }
}
