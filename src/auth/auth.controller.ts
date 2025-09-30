import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('register')
  register(@Body() registerUserDto: RegisterDto) {
    const token = this.authService.registerUser(registerUserDto);
    return token;
  }

  @Post('login')
  login(@Body() loginUserDto: LoginDto) {
    const token = this.authService.loginUser(loginUserDto);
    return token;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub;
    //remove password from user object
    const user = await this.userService.getUserById(userId);
    console.log(user);

    return user;
  }
}
