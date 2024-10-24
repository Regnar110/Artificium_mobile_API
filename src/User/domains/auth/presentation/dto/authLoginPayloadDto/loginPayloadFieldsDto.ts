import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LoginPayloadEmail } from './loginPayloadEmailDto';
import { LoginPayloadPassword } from './loginPayloadPasswordDto';

export class LoginPayloadFields {
  @ValidateNested()
  @Type(() => LoginPayloadEmail)
  email: LoginPayloadEmail;

  @ValidateNested()
  @Type(() => LoginPayloadPassword)
  password: LoginPayloadPassword;
}
