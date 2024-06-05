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
import { TryCatch } from '../utils/TryCatchDecorator';
import { UserResponses } from './responses';
import { EmailExistResponseData } from './responses.model';
import { AuthenticationService } from 'src/services/Authentication/authentication.service';
import { RedisService } from 'src/services/Redis/redis.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly bcryptService: BcryptService,
    private readonly responseBuilder: ResponseBuilderService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('signin')
  @HttpCode(200)
  @TryCatch()
  async login(@Body() body: SignInPayload, @Res() res: Response) {
    if (!body) throw new Error();

    const extractedFieldValues =
      UserRepo.extractFieldValue<ProcessedSignInCredentials>(body);

    const recievedUser = await this.usersService.getUser(extractedFieldValues);
    if (!recievedUser) {
      const response = this.responseBuilder.buildStandardResponse(
        UserResponses.signinForm.unauthorized,
      );
      return res.status(response.status).json(response);
    }

    const isPasswordMatch = await this.bcryptService.compare(
      extractedFieldValues.password,
      recievedUser.password,
    );

    delete recievedUser.password;

    if (!isPasswordMatch) {
      const response = this.responseBuilder.buildStandardResponse(
        UserResponses.signinForm.unauthorized,
      );
      return res.status(response.status).json(response);
    }
    recievedUser.password = undefined;
    const { access_token } =
      await this.authenticationService.generateJWT(recievedUser);
    await this.redisService.setAccessToken(recievedUser._id, access_token);

    const controllerEndResponse = this.responseBuilder.buildStandardResponse({
      status: HttpStatus.OK,
      payload: {
        redirect: 'dashboard',
        data: {
          jwt: access_token,
        },
      },
    });

    res.status(controllerEndResponse.status).json(controllerEndResponse);
  }

  @Post('register')
  @HttpCode(201)
  @TryCatch()
  async register(@Body() body: RegisterPayload, @Res() res: Response) {
    const userWithEmailExist = await this.usersService.findUserWithEmail({
      email: body.fields.email.value,
    });

    if (userWithEmailExist) {
      const response =
        this.responseBuilder.buildStandardResponse<EmailExistResponseData>(
          UserResponses.registerForm.emailExist,
        );

      return res.status(response.status).json(response);
    }

    body.fields.password.value = await this.bcryptService.hashString(
      body.fields.password.value,
    );

    delete body.fields.repeatpassword;

    const createdUser = await this.usersService.createUser(
      UserRepo.extractFieldValue<User>(body),
    );

    if ('email' in createdUser) {
      const response = this.responseBuilder.buildStandardResponse<{
        clientMessage: string;
      }>(UserResponses.registerForm.userCreated);
      return res.status(response.status).json(response);
    } else {
      const response = this.responseBuilder.buildStandardResponse<{
        clientMessage: string;
      }>(UserResponses.registerForm.userNotCreated);
      return res.status(response.status).json(response);
    }
  }
}
