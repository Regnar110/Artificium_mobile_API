import {
  Contains,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AuthLoginPayloadInterface } from '../../../types';
import { Type } from 'class-transformer';
import { LoginPayloadFields } from './loginPayloadFieldsDto';

export class LoginPayloadDto implements AuthLoginPayloadInterface {
  @ValidateNested()
  @Type(() => LoginPayloadFields)
  fields: LoginPayloadFields;

  @IsString()
  @IsNotEmpty()
  @Contains('signInForm')
  formId: string;
}
