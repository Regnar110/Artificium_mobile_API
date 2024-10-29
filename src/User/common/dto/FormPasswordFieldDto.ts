import { IsString, IsNotEmpty, Contains } from 'class-validator';
import { UserDomainFieldInterface } from 'src/shared/types';

export class FormPasswordField implements UserDomainFieldInterface {
  @IsString()
  @IsNotEmpty()
  @Contains('password')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
