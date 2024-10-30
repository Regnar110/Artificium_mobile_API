import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AppSession, Auth } from 'src/shared/decorators/AuthBearer.decorator';
import { ResponseBuilderService } from 'src/shared/services/ResponseBuilder/responseBuilder.service';
import { User } from 'src/User/entities/user.entity';
import { UserService } from '../../services/user.service';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { UserResponses } from 'src/User/common/responses';
import { extractFieldValue } from 'src/User/common/utilities/extractFieldValue.util';
import { RegisterPayloadDto } from '../dto/registerPayload';
import { CustomHttpExceptionFilter } from 'src/exceptions/core/CustomHttpExceptionFilter';
import { UnauthorizedCustomException } from 'src/exceptions/UnauthorizedCustomException';
import { EmailAlreadyExistException } from '../exceptions/EmailAlreadyExistException';
import { InternalServerErrorCustomException } from 'src/exceptions/InternalServerErrorCustomException';

@Controller('userManagement')
export class UserManagementController {
  constructor(
    private readonly responseBuilder: ResponseBuilderService,
    private readonly usersService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @UseFilters(CustomHttpExceptionFilter)
  async register(
    @Auth() auth: AppSession,
    @Body(new ValidationPipe()) body: RegisterPayloadDto,
    @Res() res: Response,
  ) {
    if (auth) {
      throw new UnauthorizedCustomException();
    }

    const userWithEmailExist = await this.usersService.findUserWithEmail({
      email: body.fields.email.value,
    });

    if (userWithEmailExist) {
      throw new EmailAlreadyExistException();
    }

    body.fields.password.value = await this.bcryptService.hashString(
      body.fields.password.value,
    );

    delete body.fields.repeatpassword;

    const createdUser = await this.usersService.createUser(
      extractFieldValue<User>(body),
    );

    if ('email' in createdUser) {
      const response = this.responseBuilder.buildStandardResponse<{
        clientMessage: string;
      }>(UserResponses.registerForm.userCreated);
      return res.status(response.status).json(response);
    } else {
      throw new InternalServerErrorCustomException();
    }
  }
}
