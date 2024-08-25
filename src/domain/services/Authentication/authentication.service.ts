import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseBuilderService } from '../ResponseBuilder/responseBuilder.service';
import { ProcessedUser } from 'src/modules/UserModule/user.model';
import * as fs from 'fs';
import { TryCatch } from 'src/modules/UserModule/utils/TryCatchDecorator';

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

  getJwtPublicKey() {
    const publicPemKey = fs.readFileSync('publicKey.pem');
    return publicPemKey;
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
    console.log(userPayload);
    const access_token = await this.jwtService.sign({ ...userPayload });

    return access_token;
  }

  verifyJWT(jwt: string) {
    const publicKey = this.getJwtPublicKey();
    try {
      return this.jwtService.verify(jwt, {
        secret: publicKey.toString(),
        algorithms: ['RS256'],
      });
    } catch (e) {
      return null;
    }
  }

  async decodeJWT(jwt: string) {
    return this.jwtService.decode(jwt);
  }
}
