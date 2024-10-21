import { AppSession, Auth } from 'src/shared/decorators/AuthBearer.decorator';
import { TryCatch } from 'src/shared/decorators/TryCatchDecorator';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { RedisService } from 'src/shared/services/redis/redis.service';
import { ResponseBuilderService } from 'src/shared/services/ResponseBuilder/responseBuilder.service';
import { UserService } from 'src/User/domains/userManagement/services/user.service';
import { AuthService } from '../../services/auth.service';
import { RedisResponses } from 'src/shared/services/redis/responses';
import {
  Controller,
  Post,
  HttpCode,
  Body,
  Res,
  Get,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { UserResponses } from 'src/User/common/responses';
import {
  AuthLoginCredentials,
  AuthLoginRequestPayload,
} from 'src/User/types/auth.types';
import { extractFieldValue } from 'src/User/common/utilities/extractFieldValue.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly responseBuilder: ResponseBuilderService,
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly redisService: RedisService,
    private readonly authenticationService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @TryCatch()
  async login(
    @Auth() auth: AppSession,
    @Body() body: AuthLoginRequestPayload,
    @Res() res: Response,
  ) {
    if (auth) {
      const response = this.responseBuilder.buildStandardResponse(
        UserResponses.unauthorized,
      );
      return res.status(response.status).json(response);
    }

    if (!body) throw new Error();
    const extractedFieldValues = extractFieldValue<AuthLoginCredentials>(body);

    const recievedUser = await this.userService.getUser(extractedFieldValues);
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
