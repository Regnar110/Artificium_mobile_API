import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProcessedUser } from 'src/lgcy/components/UserComponent/models/user.model';
import * as fs from 'fs';
import { ResponseBuilderService } from 'src/lgcy/domain/services/ResponseBuilder/responseBuilder.service';

@Injectable()
export class AuthService {
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
    const access_token = await this.jwtService.sign({ ...userPayload });

    return access_token;
  }

  verifyJWT(jwt: string): ProcessedUser | null {
    const publicKey = this.getJwtPublicKey();
    try {
      return this.jwtService.verify(jwt, {
        secret: publicKey.toString(),
        algorithms: ['RS256'],
      })._doc;
    } catch (e) {
      return null;
    }
  }

  async decodeJWT(jwt: string) {
    return this.jwtService.decode(jwt);
  }
}
