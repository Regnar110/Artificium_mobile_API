import { HttpStatus } from '@nestjs/common';
import { PayloadExtendedHttpException } from 'src/exceptions/core/PayloadExtendedHttpException';
import { ResponsePayloadDto } from 'src/shared/services/ResponseBuilder2/ResponsePayloadBuilder';

const exceptionDefaultPayload = {
  redirect: null,
  data: {
    formId: 'registerForm',
    field: 'email',
    clientMessage: 'This email is already used.',
  },
};

export class EmailAlreadyExistException extends PayloadExtendedHttpException {
  constructor(payload: ResponsePayloadDto = exceptionDefaultPayload) {
    super('User email already exist', HttpStatus.CONFLICT, payload);
  }
}
