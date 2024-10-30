import { HttpStatus } from '@nestjs/common';
import { PayloadExtendedHttpException } from 'src/exceptions/core/PayloadExtendedHttpException';
import { ResponsePayloadDto } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoPayloadBuilder';

const exceptionDefaultPayload: ResponsePayloadDto = {
  data: {
    formError: true,
    formId: 'signinForm',
    clientMessage: 'Provided wrong credentials.',
    jwt: null,
  },
  redirect: null,
};

export class WrongCredentialsException extends PayloadExtendedHttpException {
  constructor(payload: ResponsePayloadDto = exceptionDefaultPayload) {
    super('Provided wrong credentials', HttpStatus.UNAUTHORIZED, payload);
  }
}
