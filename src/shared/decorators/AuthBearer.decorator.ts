import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../services/redis/redis.service';
import { ResponseBuilderService } from '../services/ResponseBuilder/responseBuilder.service';
import { AuthLoginDatabaseUser } from 'src/User/types/auth.types';
import { AuthService } from 'src/User/domains/auth/services/auth.service';

export type AppSession = AuthLoginDatabaseUser | null;

export const Auth = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const jwtService = new JwtService();
    const redisService = new RedisService();
    const authService = new AuthService(jwtService);
    const token = request.headers.authorization?.split(' ')[1];
    const decodedJWTData = await authService.verifyJWT(token);

    if (decodedJWTData) {
      const tokenCheckResult = await redisService.checkTokenPresence(
        decodedJWTData._id,
      );
      if (tokenCheckResult) {
        return decodedJWTData;
      }
      return null;
    }
    return null;
  },
);
