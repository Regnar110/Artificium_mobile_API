import { Body, Controller, Post } from '@nestjs/common';
import { RegisterPayload } from './register.model';

@Controller('register')
export class RegisterController {
  @Post()
  registerUser(@Body() registerPayload: RegisterPayload) {
    console.log(registerPayload);
  }
}
