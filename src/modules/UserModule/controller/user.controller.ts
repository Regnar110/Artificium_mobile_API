import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/modules/UserModule/user.service';
import { User } from 'src/MongoDB/Schemas/user/user.schema';
import { RegisterPayload } from '../user.model';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() body: RegisterPayload) {
    const transformedObject = {};

    for (const key in body.fields) {
      transformedObject[key] = body.fields[key].value;
    }
    delete transformedObject['repeatpassword'];
    transformedObject['agreementFields'] = [...body.agreementFields];

    this.usersService.create(transformedObject as User);
  }
}
