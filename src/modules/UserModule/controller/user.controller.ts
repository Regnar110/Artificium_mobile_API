import {
  Body,
  Controller,
  ForbiddenException,
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
  /**
   * @TODO try catch error catching and handling
   * consider if there should be more try catches - even for single operations
   */
  async register(@Body() body: RegisterPayload, @Res() res: Response) {
    try {
      throw new ForbiddenException();
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

      const response = this.responseBuilder.buildStandardResponse<{
        x: string;
      }>({
        status: HttpStatus.CREATED,
        message: 'User registered successfully',
        payload: {
          redirect: REDIRECT.SIGN_IN,
          data: {
            x: '1',
          },
        },
      });
      return res.status(response.status).json(response);
    } catch (error) {
      console.log(error.status);
      console.log(
        Object.keys(HttpStatus).find((key, i) => i === Object.values(HttpStatus).findIndex(value => value === error.status))
      );
      const response = this.responseBuilder.buildStandardResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Provided by user.controller',
      });
      res.status(response.status).json(response);
    }
  }
}
