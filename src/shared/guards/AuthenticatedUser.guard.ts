import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedCustomException } from 'src/exceptions/UnauthorizedCustomException';

@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    request['auth'] = null;
    if (!token) {
      return true;
    }

    throw new UnauthorizedCustomException();
  }
}
