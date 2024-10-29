import { UserDomainFieldInterface } from 'src/shared/types';
import { AgreementContentInterface } from './agreements.types';

/**
 * @interface CreateUserPayload
 * Used in user.service on createUser method as argument type
 */
export interface CreateUserPayload {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

/**
 * @interface RegisterPayloadInterface
 * Used as contract for RegisterPayloadDto
 */
export interface RegisterPayloadInterface {
  formId: string;
  fields: {
    email: UserDomainFieldInterface;
    firstname: UserDomainFieldInterface;
    lastname: UserDomainFieldInterface;
    password: UserDomainFieldInterface;
    repeatpassword: UserDomainFieldInterface;
  };
  // agreementFields: AgreementContentInterface[];
}
