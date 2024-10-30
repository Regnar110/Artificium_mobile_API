import { HttpStatus } from '@nestjs/common';
import {
  ResponsePayloadDto,
  ResponseDtoPayloadBuilder,
} from './ResponseDtoPayloadBuilder';

interface ResponseInterface {
  status: HttpStatus;
  message: string;
  payload: ResponsePayloadDto;
}

export class ResponseDto {
  readonly status: HttpStatus;
  readonly message: string;
  readonly payload: ResponsePayloadDto;
}

export class ResponseDtoBuilder implements ResponseInterface {
  readonly status: HttpStatus;
  readonly message: string;
  readonly payload: ResponsePayloadDto;

  constructor({ status, message, payload }: ResponseDto) {
    this.status = status;
    this.message = message;
    this.payload = new ResponseDtoPayloadBuilder(payload);
  }
}
