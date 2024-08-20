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
    console.log(userPayload)
    const access_token = await this.jwtService.sign({ ...userPayload });

    return access_token;
  }

  async verifyJWT(jwt: string) {
    const secretKey = this.getJwtPrivateKey();
    console.log(secretKey)
    return this.jwtService.verifyAsync(jwt, {
      secret: process.env.JWT_SECRET,
      algorithms: ['RS256'],
    });
  }
  async decodeJWT(jwt: string) {
    return this.jwtService.decode(jwt);
  }
}
