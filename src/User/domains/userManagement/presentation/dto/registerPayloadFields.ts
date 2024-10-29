import { Type } from 'class-transformer';
import {
  Contains,
  IsNotEmpty,
  IsString,
  registerDecorator,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { FormEmailField } from 'src/User/common/dto/FormEmailFieldDto';
import { FormPasswordField } from 'src/User/common/dto/FormPasswordFieldDto';

export function Match(
  basePropertyPath: string,
  propertyPath: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [propertyPath],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyPath] = args.constraints;
          const basePropertyValue = value[basePropertyPath];
          const relatedValue = getNestedProperty(
            args.object,
            relatedPropertyPath,
          );

          return basePropertyValue === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match ${args.constraints[0]}`;
        },
      },
    });
  };
}

function getNestedProperty(object: any, propertyPath: string) {
  return propertyPath.split('.').reduce((o, p) => (o ? o[p] : null), object);
}

class FirstNameField {
  @IsString()
  @IsNotEmpty()
  @Contains('firstname')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

class LastNameField {
  @IsString()
  @IsNotEmpty()
  @Contains('lastname')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

class RepeatPasswordField {
  @IsString()
  @IsNotEmpty()
  @Contains('repeatpassword')
  id: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class RegisterPayloadFields {
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
