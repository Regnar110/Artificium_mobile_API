import { AgreementContentInterface } from 'src/MongoDB/Schemas/user/schema.model';
import { User } from 'src/MongoDB/Schemas/user/user.schema';

export interface RegisterPayload {
  formId: string;
  fields: {
    email: { id: 'email'; value: string };
    firstname: { id: 'firstname'; value: string };
    lastname: { id: 'lastname'; value: string };
    password: { id: 'password'; value: string };
    repeatpassword: { id: 'repeatpassword'; value: string };
  };
  agreementFields: AgreementContentInterface[];
}

export type SignInPayload = {
  fields: Pick<RegisterPayload['fields'], 'email' | 'password'>;
};

export type x = keyof SignInPayload;

export interface ProcessedSignInCredentials {
  email: string;
  password: string;
}

/**
 * @interface ProcessedUser
 * @description interface which describes user object prepared for JWT encryption and also
 * user object which is returned from JWT decoding
 */
export type ProcessedUser = Pick<
  User,
  '_id' | 'email' | 'firstname' | 'lastname'
>;
