import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/User/entities/user.entity';
import { CreateUserPayload } from 'src/User/types/createUser.types';

/**
 * @injectable - means that this class knows, that it can be injected to other classes which needs functionality from this class.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserPayload): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async getUser({ email }: { email: string }): Promise<User> {
    const query = this.userModel
      .findOne({ email })
      .select({ _id: 1, email: 1, firstname: 1, lastname: 1, password: 1 });
    return query.exec();
  }

  async findUserWithEmail({ email }: { email: string }) {
    return this.userModel.findOne({ email });
  }
}
