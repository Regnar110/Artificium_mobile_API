import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

/**
 * @description Decorator used in DTO validations with class-validator library. This decorator can be used
 * to compare two nested ord not nested values from decorator parent class
 * @param basePropertyPath base compared property key which is compared from decorator attached object.
 * @param propertyPath compared property key from other field of class
 * @param validationOptions custom decorator validation options i.e message property to customize message,
 */

// example

// class Example {
// 	@ValidateNested()
// 	@Type(() => FormPasswordField)
// 	password: FormPasswordField;
//
// 	@ValidateNested()
// 	@Type(() => RepeatPasswordField)
// 	@Match('value', 'password.value', { message: 'Passwords do not match' })
// 	repeatpassword: RepeatPasswordField;
// }

export function Match(
  basePropertyPath: string,
  propertyPath: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
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
