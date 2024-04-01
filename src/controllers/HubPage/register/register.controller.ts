import { Controller, Post, Req } from '@nestjs/common';

@Controller('register')
export class RegisterController {
  @Post()
  registerUser(@Req() request: Request) {
    console.log(request);
  }
}
