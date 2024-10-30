import { HttpStatus } from '@nestjs/common';
import { REDIRECT } from 'src/shared/constants/clientRouteRedirectors';
import { ResponseDtoBuilder } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoBuilder';
import { ResponseDtoPayloadBuilder } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoPayloadBuilder';

export class LogoutResponse extends ResponseDtoBuilder {
  constructor() {
    super({
      status: HttpStatus.OK,
      message: 'See you soon!',
      payload: new ResponseDtoPayloadBuilder({
        redirect: REDIRECT.SIGN_IN,
        data: null,
      }),
    });
  }
}
