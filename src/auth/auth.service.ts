import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { LoginDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registerUserDto: RegisterDto) {
    //hash password
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hashedPassword,
    });
    const payload = {
      sub: user.user._id,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async loginUser(loginUserDto: LoginDto) {
    const user = await this.userService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    const payload = {
      sub: user._id,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
