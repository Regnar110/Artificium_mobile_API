import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseModelDto, StandardResponseType } from './responseModel.dto';

@Injectable()
export class ResponseBuilderService {
  constructor() {}

  buildStandardResponse<PayloadT>({
    status,
    message = null,
    payload = { redirect: null, data: null },
  }: StandardResponseType<PayloadT>) {
    return Object.assign(new ResponseModelDto(), {
      status,
      message: `${HttpStatus[HttpStatus[status]]}: ${message}`,
      payload,
    });
  }
}
