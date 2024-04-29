import { Body, Controller, Post } from '@nestjs/common';
import { RegisterPayload } from './register.model';
import { UsersService } from 'src/modules/UserModule/user.service';
import { CreateUserDto } from 'src/modules/UserModule/createUserDto';
import { User } from 'src/MongoDB/Schemas/registered_user/user.schema';

@Controller('register')
export class RegisterController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  registerUser(@Body() registerPayload: RegisterPayload) {
    const transformedObject = {};

    for (const key in registerPayload.fields) {
      transformedObject[key] = registerPayload.fields[key].value;
    }
    delete transformedObject['repeatpassword'];
    transformedObject['agreementFields'] = [...registerPayload.agreementFields];

    const x = this.usersService.create(transformedObject as User);
  }
}
