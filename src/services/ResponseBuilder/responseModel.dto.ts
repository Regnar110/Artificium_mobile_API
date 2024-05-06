import { HttpStatus } from '@nestjs/common';

export interface DTOPayloadType<T> {
  redirect?: string | null;
  data?: T;
}

export type StandardResponseType<PayloadT> = {
  status: HttpStatus;
  textMessage: string;
  errorMessage?: string | null;
  payload?: DTOPayloadType<PayloadT> | DTOPayloadType<null>;
};

export class ResponseModelDto {
  readonly status: number;
  readonly textMessage: string;
  readonly errorMessage: string | null;
  readonly payload: DTOPayloadType<unknown>;
}
