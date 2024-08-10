import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseBuilderService } from '../ResponseBuilder/responseBuilder.service';
import { ProcessedUser } from 'src/modules/UserModule/user.model';
import * as fs from 'fs';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private responseBuilder: ResponseBuilderService,
  ) {}

  getJwtPrivateKey() {
    const pemKey = fs.readFileSync('privateKey.pem');
    return pemKey;
  }

  async generateJWT(userPayload: ProcessedUser) {
    if (!userPayload)
      this.responseBuilder.throwInternalError(
        this.constructor.name,
        this.generateJWT.name,
      );

    const secretKey = this.getJwtPrivateKey();
    if (!secretKey) {
      this.responseBuilder.throwInternalError(
        this.constructor.name,
        this.generateJWT.name,
      );
    }
    const access_token = await this.jwtService.signAsync(
      JSON.stringify(userPayload),
      {
        privateKey: secretKey.toString(),
      },
    );

    return access_token;
  }

  async decodeJWT(jwt: string) {
    return this.jwtService.decode(jwt);
  }
}
