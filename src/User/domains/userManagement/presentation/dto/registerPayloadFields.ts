import { Type } from 'class-transformer';
import {
  Contains,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Match } from 'src/shared/decorators/ClassValidatorDecorators/Match';
import { UserDomainFieldInterface } from 'src/shared/types';
import { FormEmailField } from 'src/User/common/dto/FormEmailFieldDto';
import { FormPasswordField } from 'src/User/common/dto/FormPasswordFieldDto';

class FirstNameField implements UserDomainFieldInterface {
  @IsString()
  @IsNotEmpty()
  @Contains('firstname')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

class LastNameField implements UserDomainFieldInterface {
  @IsString()
  @IsNotEmpty()
  @Contains('lastname')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

class RepeatPasswordField implements UserDomainFieldInterface {
  @IsString()
  @IsNotEmpty()
  @Contains('repeatpassword')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class RegisterPayloadFields {
  formId: string;
  @ValidateNested()
  @Type(() => FormEmailField)
  email: FormEmailField;

  @ValidateNested()
  @Type(() => FirstNameField)
  firstname: FirstNameField;

  @ValidateNested()
  @Type(() => LastNameField)
  lastname: LastNameField;

  @ValidateNested()
  @Type(() => FormPasswordField)
  password: FormPasswordField;

  @ValidateNested()
  @Type(() => RepeatPasswordField)
  @Match('value', 'password.value', { message: 'Passwords do not match' })
  repeatpassword: RepeatPasswordField;
}
