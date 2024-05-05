import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor() {}

  async hashString(password: string, saltRounds = 10) {
    return await bcrypt.hash(password, saltRounds);
  }

  async compare(providedPassword: string, databaseHashPassword: string) {
    await bcrypt.compare(providedPassword, databaseHashPassword);
  }
}
