import { AgreementContentInterface } from 'src/MongoDB/Schemas/registered_user/schema.model';

export class CreateUserDto {
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly password: string;
  readonly agreementFields: AgreementContentInterface[];
}
