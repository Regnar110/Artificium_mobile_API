import { HttpStatus } from '@nestjs/common';
import { ResponsePayloadDto, ResponsePayload } from './ResponsePayloadBuilder';

interface ResponseInterface {
  status: HttpStatus;
  message: string;
  payload: ResponsePayloadDto;
}

class ResponseDto {
  readonly status: HttpStatus;
  readonly message: string;
  readonly payload: ResponsePayloadDto;
}


export class ResponseBuilder implements ResponseInterface {
  readonly status: HttpStatus;
  readonly message: string;
  readonly payload: ResponsePayloadDto;

  constructor({ status, message, payload }: ResponseDto) {
    this.status = status;
    this.message = message;
    this.payload = new ResponsePayload(payload);
  }
}
