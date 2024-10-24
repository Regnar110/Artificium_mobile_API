import { IsString, IsNotEmpty, Contains } from 'class-validator';
import { AuthLoginUserPasswordInterface } from '../../../types';

export class LoginPayloadPassword implements AuthLoginUserPasswordInterface {
  @IsString()
  @IsNotEmpty()
  @Contains('password')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
