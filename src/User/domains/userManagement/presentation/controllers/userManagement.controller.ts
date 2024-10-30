import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/User/entities/user.entity';
import { UserService } from '../../services/user.service';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { extractFieldValue } from 'src/User/common/utilities/extractFieldValue.util';
import { RegisterPayloadDto } from '../dto/registerPayload';
import { CustomHttpExceptionFilter } from 'src/exceptions/core/CustomHttpExceptionFilter';
import { EmailAlreadyExistException } from '../exceptions/EmailAlreadyExistException';
import { InternalServerErrorCustomException } from 'src/exceptions/InternalServerErrorCustomException';
import { UserCreatedResponse } from '../responses/UserCreatedResponse';
import { AuthenticatedUserGuard } from 'src/shared/guards/AuthenticatedUser.guard';

@Controller('userManagement')
export class UserManagementController {
  constructor(
    private readonly usersService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @UseGuards(AuthenticatedUserGuard)
  @UseFilters(CustomHttpExceptionFilter)
  async register(
    @Body(new ValidationPipe()) body: RegisterPayloadDto,
    @Res() res: Response,
  ) {
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
      return res.status(HttpStatus.CREATED).json(new UserCreatedResponse());
    } else {
      throw new InternalServerErrorCustomException();
    }
  }
}
