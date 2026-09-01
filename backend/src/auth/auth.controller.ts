import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerData: CreateUserDto) { 
    return this.authService.register(registerData);
  }

  @Post('login')
  login(@Body() loginData: any/*LoginDto*/) { 
    return this.authService.login(loginData);
  }
}