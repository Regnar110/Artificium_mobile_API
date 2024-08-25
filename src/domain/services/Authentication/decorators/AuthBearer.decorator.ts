import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseBuilderService } from '../../ResponseBuilder/responseBuilder.service';
import { RedisService } from '../../Redis/redis.service';

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
        decodedJWTData._doc._id,
      );

      if (tokenCheckResult) {
        return decodedJWTData._doc;
      }
      return null;
    }
    return null;
  },
);