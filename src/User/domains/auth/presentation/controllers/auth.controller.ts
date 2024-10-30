import { AppSession, Auth } from 'src/shared/decorators/AuthBearer.decorator';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { RedisService } from 'src/shared/services/redis/redis.service';
import { UserService } from 'src/User/domains/userManagement/services/user.service';
import { AuthService } from '../../services/auth.service';
import {
  Controller,
  Post,
  HttpCode,
  Body,
  Res,
  Get,
  HttpStatus,
  Req,
  ValidationPipe,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginCredentials } from 'src/User/types/auth.types';
import { extractFieldValue } from 'src/User/common/utilities/extractFieldValue.util';
import { LoginPayloadDto } from '../dto/authLoginPayloadDto/loginPayload.dto';
import { UnauthorizedCustomException } from 'src/exceptions/UnauthorizedCustomException';
import { CustomHttpExceptionFilter } from 'src/exceptions/core/CustomHttpExceptionFilter';
import { WrongCredentialsException } from '../exceptions/WrongCredentialsException';
import { InternalServerErrorCustomException } from 'src/exceptions/InternalServerErrorCustomException';
import { AuthorizedResponse } from '../responses/AuthorizedResponse';
import { LogoutResponse } from '../responses/LogoutResponse';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly redisService: RedisService,
    private readonly authenticationService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @UseFilters(CustomHttpExceptionFilter)
  async login(
    @Auth() auth: AppSession,
    @Body(new ValidationPipe()) body: LoginPayloadDto,
    @Res() res: Response,
  ) {
    if (auth) {
      throw new UnauthorizedCustomException();
    }
    if (!body) throw new Error();
    const extractedFieldValues = extractFieldValue<AuthLoginCredentials>(body);
    const recievedUser = await this.userService.getUser(extractedFieldValues);
    if (!recievedUser) {
      throw new WrongCredentialsException();
    }
    const isPasswordMatch = await this.bcryptService.compare(
      extractedFieldValues.password,
      recievedUser.password,
    );

    delete recievedUser.password;

    if (!isPasswordMatch) {
      throw new WrongCredentialsException();
    }

    recievedUser.password = undefined;

    const access_token =
      await this.authenticationService.generateJWT(recievedUser);
    await this.redisService.setKeyValuePair(recievedUser._id, access_token);

    res.status(HttpStatus.OK).json(new AuthorizedResponse(access_token));
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @UseFilters(CustomHttpExceptionFilter)
  async logout(
    @Auth() auth: AppSession,
    @Req() _req: Request,
    @Res() res: Response,
  ) {
    if (!auth) {
      throw new UnauthorizedCustomException();
    }
    const redisSessionRemoveResult: number =
      await this.redisService.removeKeyValuePair(auth._id);

    if (!redisSessionRemoveResult || redisSessionRemoveResult < 1) {
      throw new InternalServerErrorCustomException();
    }

    return res.status(HttpStatus.OK).json(new LogoutResponse());
  }
}
