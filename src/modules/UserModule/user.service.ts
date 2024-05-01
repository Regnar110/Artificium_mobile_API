import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './createUserDto';
import { User } from 'src/MongoDB/Schemas/user/user.schema';
import { ProcessedSignInCredentials } from './user.model';

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

  async getUser({
    email,
    password,
  }: ProcessedSignInCredentials): Promise<User> {
    return this.userModel.findOne({ email, password }).exec();
  }
}