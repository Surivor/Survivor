import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(userData: Partial<User>): Promise<Partial<User>> {
    const { name, email, password, firstname, status } = userData;

    if (!name || !email) {
      throw new BadRequestException('name and email are required');
    }

    const newUser = this.usersRepository.create({
      name: name.trim(),
      email: email.trim(),
      password: password || '',
      firstname: firstname ? firstname.trim() : name.trim(),
      status: status || 'active',
    });

    await this.usersRepository.save(newUser);

    return {
      name: newUser.name,
      firstname: newUser.firstname,
      email: newUser.email,
      status: newUser.status,
    };
  }
}
