import { HttpStatus } from '@nestjs/common';

export interface DTOPayloadType<T> {
  redirect?: string | null;
  data?: T;
}

export type StandardResponseType<PayloadT> = {
  status: HttpStatus;
  message: string | null;
  payload?: DTOPayloadType<PayloadT> | DTOPayloadType<null>;
};


export class ResponseModelDto<PayloadT> {
  readonly status: number;
  readonly message: string | null;
  readonly payload: DTOPayloadType<PayloadT> | null;
}
