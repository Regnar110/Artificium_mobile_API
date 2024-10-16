import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserResponses } from 'src/lgcy/components/UserComponent/controller/authentication/responses';
import { EmailExistResponseData } from 'src/lgcy/components/UserComponent/controller/authentication/responses.model';
import { RegisterPayload } from 'src/lgcy/components/UserComponent/models/user.model';
import UserRepo from 'src/lgcy/components/UserComponent/utils/user.util';
import { AppSession } from 'src/lgcy/domain/services/Authentication/auth.model';
import { Auth } from 'src/shared/decorators/AuthBearer.decorator';
import { TryCatch } from 'src/shared/decorators/TryCatchDecorator';
import { ResponseBuilderService } from 'src/shared/services/ResponseBuilder/responseBuilder.service';
import { User } from 'src/User/entities/user.entity';
import { UserService } from '../../services/user.service';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';

@Controller('userManagement')
export class UserManagementController {
  constructor(
    private readonly responseBuilder: ResponseBuilderService,
    private readonly usersService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @TryCatch()
  async register(
    @Auth() auth: AppSession,
    @Body() body: RegisterPayload,
    @Res() res: Response,
  ) {
    console.log(auth)
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
}
