import { User } from '../entities/user.entity';
import { CreateUserRequestPayload } from './createUser.types';

export type AuthLoginRequestPayload = {
  fields: Pick<CreateUserRequestPayload['fields'], 'email' | 'password'>;
};


export interface AuthLoginCredentials {
  email: string;
  password: string;
}

/**
 * @interface ProcessedUser
 * @description interface which describes user object prepared for JWT encryption and also
 * user object which is returned from JWT decoding
 */
export type AuthLoginDatabaseUser = Pick<
  User,
  '_id' | 'email' | 'firstname' | 'lastname'
>;
