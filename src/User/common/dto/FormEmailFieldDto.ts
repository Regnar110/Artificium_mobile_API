import { IsString, IsNotEmpty, Contains, IsEmail } from 'class-validator';
import { UserDomainFieldInterface } from 'src/shared/types';

export class FormEmailField implements UserDomainFieldInterface {
  @IsString()
  @IsNotEmpty()
  @Contains('email')
  id: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  value: string;
}
