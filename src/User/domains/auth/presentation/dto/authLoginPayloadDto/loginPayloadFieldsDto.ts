import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FormEmailField } from 'src/User/common/dto/FormEmailFieldDto';
import { FormPasswordField } from 'src/User/common/dto/FormPasswordFieldDto';

export class LoginPayloadFields {
  @ValidateNested()
  @Type(() => FormEmailField)
  email: FormEmailField;

  @ValidateNested()
  @Type(() => FormPasswordField)
  password: FormPasswordField;
}
