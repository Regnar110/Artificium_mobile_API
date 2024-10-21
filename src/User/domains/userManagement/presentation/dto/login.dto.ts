import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class LoginDto {
  @ValidateNested()
  fields: {
    email: UserEmail;
    password: UserPassword;
  };
  @IsNumber()
  formId: string;
}

class UserEmail {
  @IsNotEmpty()
  id: string;
  @IsEmail()
  value: string;
}

class UserPassword {
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  value: string;
}
