import { HttpException, HttpExceptionOptions } from '@nestjs/common';
import { ResponsePayloadDto } from 'src/shared/dto/ResponseDtoBuilder/ResponseDtoPayloadBuilder';

export class PayloadExtendedHttpException extends HttpException {
  payload: ResponsePayloadDto;
  constructor(
    response: string | Record<string, any>,
    status: number,
    payload: ResponsePayloadDto,
    options?: HttpExceptionOptions,
  ) {
    super(response, status, options);
    this.payload = payload;
  }
}
