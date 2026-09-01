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

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
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

  getPartners() {
    return [
      { id: 1, name: 'Greenwich Bakery', category: 'Bakery', address: '123 Baker St' },
      { id: 2, name: 'Downtown Bistro', category: 'Restaurant', address: '45 Main St' },
      { id: 3, name: 'Tech Hub Cafe', category: 'Cafe', address: '78 Silicon Ave' },
      { id: 4, name: 'Central Sushi', category: 'Restaurant', address: '12 Sushi Blvd' },
      { id: 5, name: 'Urban Salads', category: 'Healthy Food', address: '99 Green Way' }
    ];
  }
}

