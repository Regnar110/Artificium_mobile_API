import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseBuilderService } from '../ResponseBuilder/responseBuilder.service';
import { ProcessedUser } from 'src/modules/UserModule/user.model';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private responseBuilder: ResponseBuilderService,
  ) {}

  async generateJWT(userPayload: ProcessedUser) {
    if (!userPayload)
      this.responseBuilder.throwInternalError(
        this.constructor.name,
        this.generateJWT.name,
      );
    return {
      access_token: await this.jwtService.signAsync(
        JSON.stringify(userPayload),
      ),
    };
  }

  async decodeJWT(jwt: string) {
    return this.jwtService.decode(jwt);
  }
}
