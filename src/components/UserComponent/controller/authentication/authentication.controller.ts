import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  Req,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import UserRepo from '../../utils/user.util';
import { User } from 'src/MongoDB/Schemas/user/user.schema';
import { AuthenticationService } from 'src/domain/services/Authentication/authentication.service';
import { BcryptService } from 'src/domain/services/bcrypt/bcrypt.service';
import { RedisService } from 'src/domain/services/Redis/redis.service';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';
import {
  SignInPayload,
  ProcessedSignInCredentials,
  RegisterPayload,
} from '../../models/user.model';
import { UsersService } from '../../services/user.service';
import { TryCatch } from '../../../../domain/decorators/TryCatchDecorator';
import { UserResponses } from './responses';
import { EmailExistResponseData } from './responses.model';
import { Auth } from 'src/domain/decorators/AuthBearer.decorator';
import { AppSession } from 'src/domain/services/Authentication/auth.model';
import { RedisResponses } from 'src/domain/services/Redis/responses';

@Controller('authentication')
export class AuthenticationController {
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
  async login(
    @Auth() auth: AppSession,
    @Body() body: SignInPayload,
    @Res() res: Response,
  ) {
    if (auth) {
      const response = this.responseBuilder.buildStandardResponse(
        UserResponses.unauthorized,
      );
      return res.status(response.status).json(response);
    }

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
    const access_token =
      await this.authenticationService.generateJWT(recievedUser);
    await this.redisService.setKeyValuePair(recievedUser._id, access_token);

    const jwtResponse = UserResponses.signinForm.authorized;
    jwtResponse.payload.data.jwt = access_token;

    const controllerEndResponse =
      this.responseBuilder.buildStandardResponse(jwtResponse);

    res.status(controllerEndResponse.status).json(controllerEndResponse);
  }

  @Post('register')
  @HttpCode(201)
  @TryCatch()
  async register(
    @Auth() auth: AppSession,
    @Body() body: RegisterPayload,
    @Res() res: Response,
  ) {
    if (auth) {
      const response = this.responseBuilder.buildStandardResponse(
        UserResponses.unauthorized,
      );
      return res.status(response.status).json(response);
    }

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

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Auth() auth: AppSession,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!auth) {
      const response = this.responseBuilder.buildStandardResponse(
        UserResponses.unauthorized,
      );
      return res.status(response.status).json(response);
    }
    const redisSessionRemoveResult: number =
      await this.redisService.removeKeyValuePair(auth._id);

    if (!redisSessionRemoveResult || redisSessionRemoveResult < 1) {
      const response = this.responseBuilder.buildStandardResponse(
        RedisResponses.sessionNotDeleted,
      );

      return res.status(response.status).json(response);
    }

    const successResponse = this.responseBuilder.buildStandardResponse(
      UserResponses.logout,
    );
    return res.status(successResponse.status).json(successResponse);
  }
}
