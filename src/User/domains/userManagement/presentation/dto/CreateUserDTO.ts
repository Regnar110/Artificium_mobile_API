import { AgreementContentInterface } from 'src/User/types/agreements.types';

export class CreateUserDto {
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly password: string;
  readonly agreementFields: AgreementContentInterface[];
  readonly friendList: Array<string>;
}
