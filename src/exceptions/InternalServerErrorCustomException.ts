import { HttpStatus } from '@nestjs/common';
import { ResponsePayloadDto } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoPayloadBuilder';
import { PayloadExtendedHttpException } from './core/PayloadExtendedHttpException';

const exceptionDefaultPayload: ResponsePayloadDto = {
  redirect: null,
  data: {
    clientMessage:
      'Something went wrong. Please refresh the app and try again or contact us.',
  },
};

export class InternalServerErrorCustomException extends PayloadExtendedHttpException {
  constructor(payload: ResponsePayloadDto = exceptionDefaultPayload) {
    super('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR, payload);
  }
}
