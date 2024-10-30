import { HttpStatus } from '@nestjs/common';
import { ResponsePayloadDto } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoPayloadBuilder';
import { PayloadExtendedHttpException } from './core/PayloadExtendedHttpException';

export class UnauthorizedCustomException extends PayloadExtendedHttpException {
  constructor(payload: ResponsePayloadDto = { data: null, redirect: null }) {
    super('UNAUTHORIZED', HttpStatus.UNAUTHORIZED, payload);
  }
}
