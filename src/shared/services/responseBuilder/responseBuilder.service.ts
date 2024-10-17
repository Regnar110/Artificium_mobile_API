import { Injectable } from '@nestjs/common';
import { ResponseModelDto, StandardResponseType } from './dto/responseDto';

@Injectable()
export class ResponseBuilderService {
  constructor() {}

  buildStandardResponse<PayloadT>({
    status,
    message = null,
    payload = { redirect: null, data: null },
  }: StandardResponseType<PayloadT>) {
    return Object.assign(new ResponseModelDto<PayloadT>(), {
      status,
      message: `${message || ''}`,
      payload,
    });
  }

  throwInternalError(constructorName: string, methodName: string) {
    throw new Error(
      `catched with class ${constructorName} on method ${methodName}`,
    );
  }
}
