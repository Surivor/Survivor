import { Injectable, UnauthorizedException, BadRequestException  } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(userData: CreateUserDto) {
    if (!userData.password) {
      throw new BadRequestException('No password');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = { ...userData, password: hashedPassword };
    return this.usersService.create(newUser);
  }

  async login(loginData: LoginDto) {
    const user = await this.usersService.findByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Id didn\'t match');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Id didn\'t match');
    }

    const { password, ...result } = user;
    return { message: 'Connected', user: result };
  }
}