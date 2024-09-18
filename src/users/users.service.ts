import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword
    });
    
    createdUser.save();

    return {message: "Вы успешно зарегистрировались!"}
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

}
