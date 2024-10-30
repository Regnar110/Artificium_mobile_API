import { AuthLoginDatabaseUser } from 'src/User/types/auth.types';

export interface UserDomainFieldInterface {
  id: string;
  value: string;
}

export interface AuthRequest extends Request {
  auth: AuthLoginDatabaseUser | null;
}