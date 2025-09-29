import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(registerUserDto: RegisterDto) {
    try {
        console.log("Creating user");
        
      const createdUser = await this.userModel.create({
        fullName: registerUserDto.fullName,
        email: registerUserDto.email,
        password: registerUserDto.password,
        role: registerUserDto.role || 'student',
      });
      return { message: 'user created successfully', user: createdUser };
    } catch (error: unknown) {
      const e = error as { code?: number };

      const DUPLICATE_KEY_ERROR = 11000;
      if (e.code === DUPLICATE_KEY_ERROR) {
        throw new ConflictException(
          'Email already exists',
          registerUserDto.email,
        );
      }
      throw error;
    }
  }
}
