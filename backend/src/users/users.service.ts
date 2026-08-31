import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(userData: CreateUserDto): Promise<Partial<User>> {
    const { name, email, password, firstname, status } = userData;

    if (!name || !email) {
      throw new BadRequestException('Name and email are required');
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

  async update(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = this.usersRepository.merge(user, updateData);
    
    return await this.usersRepository.save(updatedUser);
  }
}