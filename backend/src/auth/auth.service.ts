import { Injectable, UnauthorizedException, BadRequestException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
//import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
        private usersService: UsersService,
        private jwtService: JwtService
  ) {}

  async register(userData: CreateUserDto) {
    if (!userData.password) {
      throw new BadRequestException('No password');
    }

    const newUser = { ...userData, password: userData.password };
    return this.usersService.create(newUser);
  }

  async login(loginData: any/*LoginDto*/) {
    const user = await this.usersService.findByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Id didn\'t match');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Id didn\'t match');
    }

    const payload = { sub: user.id, email: user.email, status: user.status };

    return {
      message: 'Connected',
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}