import { RegisterPayloadFields } from './registerPayloadFields';
import { Type } from 'class-transformer';
import {
  Contains,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RegisterPayloadInterface } from 'src/User/types/createUser.types';

export class RegisterPayloadDto implements RegisterPayloadInterface {
  @IsString()
  @IsNotEmpty()
  @Contains('registerForm')
  formId: string;

  @ValidateNested()
  @Type(() => RegisterPayloadFields)
  fields: RegisterPayloadFields;
}
