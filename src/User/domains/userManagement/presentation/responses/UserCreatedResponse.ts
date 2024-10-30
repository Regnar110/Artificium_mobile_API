import { HttpStatus } from '@nestjs/common';
import { REDIRECT } from 'src/shared/constants/clientRouteRedirectors';
import { ResponseDtoBuilder } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoBuilder';
import { ResponseDtoPayloadBuilder } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoPayloadBuilder';

export class UserCreatedResponse extends ResponseDtoBuilder {
  constructor() {
    super({
      status: HttpStatus.CREATED,
      message: 'User registered successfully.',
      payload: new ResponseDtoPayloadBuilder({
        redirect: REDIRECT.SIGN_IN,
        data: {
          clientMessage:
            'User registered successfully. Use your passwords to log in.',
        },
      }),
    });
  }
}
