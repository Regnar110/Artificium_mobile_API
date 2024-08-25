import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../controller/authentication/createUserDto';
import { User } from 'src/MongoDB/Schemas/user/user.schema';
import { ProcessedSignInCredentials } from '../models/user.model';

/**
 * @injectable - means that this class knows, that it can be injected to other classes which needs functionality from this class.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async getUser({ email }: ProcessedSignInCredentials): Promise<User> {
    const query = this.userModel
      .findOne({ email })
      .select({ _id: 1, email: 1, firstname: 1, lastname: 1, password: 1 });
    return query.exec();
  }

  async findUserWithEmail({ email }: { email: string }) {
    return this.userModel.findOne({ email });
  }
}
