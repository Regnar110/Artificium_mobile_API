import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from 'src/lgcy/domain/services/Authentication/authentication.service';
import { RedisService } from '../services/redis/redis.service';
import { ResponseBuilderService } from '../services/ResponseBuilder/responseBuilder.service';

export const Auth = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const jwtService = new JwtService();
    const redisService = new RedisService();
    const responseService = new ResponseBuilderService();
    const authService = new AuthenticationService(jwtService, responseService);
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
