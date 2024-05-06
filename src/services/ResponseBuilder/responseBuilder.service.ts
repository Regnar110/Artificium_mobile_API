import { Injectable } from '@nestjs/common';
import { ResponseModelDto, StandardResponseType } from './responseModel.dto';

@Injectable()
export class ResponseBuilderService {
  constructor() {}

  buildStandardResponse<PayloadT>({
    status,
    textMessage,
    errorMessage = null,
    payload = { redirect: null, data: null },
  }: StandardResponseType<PayloadT>) {
	console.log(this)
    return Object.assign(new ResponseModelDto(), {
      status,
      textMessage,
      errorMessage,
      payload,
    });
  }
}
