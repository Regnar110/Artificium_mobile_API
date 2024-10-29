import { IsString, IsNotEmpty, Contains, IsEmail } from 'class-validator';

export class FormEmailField {
  @IsString()
  @IsNotEmpty()
  @Contains('email')
  id: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  value: string;
}
