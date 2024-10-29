import { IsString, IsNotEmpty, Contains } from 'class-validator';

export class FormPasswordField {
  @IsString()
  @IsNotEmpty()
  @Contains('password')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
