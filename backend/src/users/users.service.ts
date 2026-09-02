import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: { id: id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(userData: CreateUserDto): Promise<Partial<User>> {
    const { name, email, password, firstname, status, siren_entreprise } = userData;

    if (!name || !email) {
      throw new BadRequestException('Name and email are required');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : '';

    const newUser = this.usersRepository.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      firstname: firstname ? firstname.trim() : name.trim(),
      status: status || 'active',
      siren_entreprise: siren_entreprise,
    });

    await this.usersRepository.save(newUser);

    return newUser; 
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

