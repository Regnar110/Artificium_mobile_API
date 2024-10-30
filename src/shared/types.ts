import { AuthLoginDatabaseUser } from 'src/User/types/auth.types';
import { ResponseDto } from './dto/ResponseDtoBuilder/ResponseDtoBuilder';
import { Response } from 'express';
export interface UserDomainFieldInterface {
  id: string;
  value: string;
}

export interface AuthRequest extends Request {
  auth: AuthLoginDatabaseUser | null;
}

export type DtoResponse = Response<ResponseDto>;
