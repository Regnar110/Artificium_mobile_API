export interface ResponsePayloadInterface {
  redirect: string;
  data: unknown;
}
export class ResponsePayloadDto implements ResponsePayloadInterface {
  readonly redirect: string;
  readonly data: unknown;
}

export class ResponsePayload implements ResponsePayloadDto {
  redirect: string;
  data: unknown;
  constructor(payload: ResponsePayloadDto) {
    this.data = payload.data;
    this.redirect = payload.redirect;
  }
}
