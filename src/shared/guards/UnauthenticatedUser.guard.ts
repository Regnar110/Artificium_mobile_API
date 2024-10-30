import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/User/domains/auth/services/auth.service';
import { RedisService } from '../services/redis/redis.service';
import { UnauthorizedCustomException } from 'src/exceptions/UnauthorizedCustomException';

@Injectable()
export class UnauthenticatedUserGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    const decodedJWTData = this.authService.verifyJWT(token);
    if (!decodedJWTData) {
      throw new UnauthorizedCustomException();
    }

    const tokenCheckResult = await this.redisService.checkTokenPresence(
      decodedJWTData._id,
    );

    if (!tokenCheckResult) {
      throw new UnauthorizedCustomException();
    }

    request['auth'] = decodedJWTData;
    // JWT is provided with auth bearer and token is present in redis.
    return true;
  }
}
