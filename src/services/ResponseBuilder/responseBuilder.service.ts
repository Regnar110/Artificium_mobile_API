import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseModelDto, StandardResponseType } from './responseModel.dto';
import { getEnumKeyByEnumValue } from 'src/modules/UserModule/utils/getEnumKeyByEnumValue';

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
      message: `${getEnumKeyByEnumValue(HttpStatus, status)}: ${message || ''}`,
      payload,
    });
  }
}
