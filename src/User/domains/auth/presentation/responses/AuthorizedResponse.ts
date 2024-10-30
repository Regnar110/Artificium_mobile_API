import { HttpStatus } from '@nestjs/common';
import { REDIRECT } from 'src/shared/constants/clientRouteRedirectors';
import { ResponseDtoBuilder } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoBuilder';
import { ResponseDtoPayloadBuilder } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoPayloadBuilder';

export class AuthorizedResponse extends ResponseDtoBuilder {
  constructor(jwt: string) {
    super({
      status: HttpStatus.OK,
      message: 'OK',
      payload: new ResponseDtoPayloadBuilder({
        redirect: REDIRECT.DASHBOARD,
        data: {
          formError: false,
          formId: 'signinForm',
          clientMessage: null,
          jwt,
        },
      }),
    });
  }
}
