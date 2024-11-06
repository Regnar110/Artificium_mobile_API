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
  UseGuards,
} from '@nestjs/common';
import { AuthLoginCredentials } from 'src/User/types/auth.types';
import { extractFieldValue } from 'src/User/common/utilities/extractFieldValue.util';
import { LoginPayloadDto } from '../dto/authLoginPayloadDto/loginPayload.dto';
import { CustomHttpExceptionFilter } from 'src/exceptions/core/CustomHttpExceptionFilter';
import { WrongCredentialsException } from '../exceptions/WrongCredentialsException';
import { InternalServerErrorCustomException } from 'src/exceptions/InternalServerErrorCustomException';
import { AuthorizedResponse } from '../responses/AuthorizedResponse';
import { LogoutResponse } from '../responses/LogoutResponse';
import { AuthenticatedUserGuard } from 'src/shared/guards/AuthenticatedUser.guard';
import { UnauthenticatedUserGuard } from 'src/shared/guards/UnauthenticatedUser.guard';
import { AuthRequest, DtoResponse } from 'src/shared/types';

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
  @UseGuards(AuthenticatedUserGuard)
  @UseFilters(CustomHttpExceptionFilter)
  async login(
    @Body(new ValidationPipe()) body: LoginPayloadDto,
    @Res() res: DtoResponse,
  ) {
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
  @UseGuards(UnauthenticatedUserGuard)
  async logout(@Req() req: AuthRequest, @Res() res: DtoResponse) {
    const redisSessionRemoveResult: number =
      await this.redisService.removeKeyValuePair(req.auth._id);

    if (!redisSessionRemoveResult || redisSessionRemoveResult < 1) {
      throw new InternalServerErrorCustomException();
    }

    return res.status(HttpStatus.OK).json(new LogoutResponse());
  }
}
