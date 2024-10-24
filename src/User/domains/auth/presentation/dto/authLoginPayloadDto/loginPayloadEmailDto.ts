import { IsString, IsNotEmpty, IsEmail, Contains } from 'class-validator';
import { AuthLoginUserEmailInterface } from '../../../types';

export class LoginPayloadEmail implements AuthLoginUserEmailInterface {
  @IsString()
  @IsNotEmpty()
  @Contains('email')
  id: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  value: string;
}
