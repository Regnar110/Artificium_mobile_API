import { AgreementContentInterface } from 'src/User/types/agreements.types';
import { RegisterPayloadFields } from './registerPayloadFields';
import { Type } from 'class-transformer';
import {
  Contains,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly password: string;
  readonly agreementFields: AgreementContentInterface[];
  readonly friendList: Array<string>;
}

export class RegisterPayload {
  @IsString()
  @IsNotEmpty()
  @Contains('registerForm')
  formId: string;

  @ValidateNested()
  @Type(() => RegisterPayloadFields)
  fields: RegisterPayloadFields;
}
