import { Injectable, BadRequestException, NotFoundException, ConflictException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

import { NotificationsService } from '../notification/notification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async findAllAdmin(search?: string, status?: string, isVerified?: string): Promise<User[]> {
    const whereConditions: any[] = [];
    const verifiedFilter = isVerified !== undefined ? { isVerified: isVerified === 'true' } : {};

    if (search) {
      const query = `%${search}%`;
      whereConditions.push(
        { name: ILike(query), ...(status ? { status } : {}), ...verifiedFilter },
        { email: ILike(query), ...(status ? { status } : {}), ...verifiedFilter },
      );
    } else {
      const condition: any = { ...verifiedFilter };
      if (status) condition.status = status;
      if (Object.keys(condition).length > 0) {
        whereConditions.push(condition);
      }
    }

    return this.usersRepository.find({
      where: whereConditions.length > 0 ? whereConditions : {},
      order: { id: 'ASC' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isVerified: true,
        isAdmin: true,
      },
    });
  }

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

  async findByStatus(status: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { status },
    });
  }

  async create(userData: CreateUserDto): Promise<Partial<User>> {
    const { name, email, password, firstname, status, siren_entreprise } = userData;

    if (!name || !email) {
      throw new BadRequestException('Name and email are required');
    }

    const existingUser = await this.findByEmail(email.trim());
    if (existingUser) {
      throw new ConflictException(`L'adresse email ${email} est déjà utilisée.`);
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

    try {
      await this.usersRepository.save(newUser);
      
      this.notificationsService.sendNewUserRegistered(newUser);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`L'adresse email ${email} est déjà utilisée.`);
      }
      throw error;
    }

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

  async getProfileInfo(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: {
        id: true,
        name: true,
        firstname: true,
        email: true,
        status: true,
        siren_entreprise: true,
      }
    });

    if (!user) {
      throw new NotFoundException('User undefined');
    }

    return user;
  }

  async getProfileInfoByID(id: string): Promise<User> {
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new NotFoundException(`ID invalide : ${id}`);
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstname: true,
        email: true,
        status: true,
        isAdmin: true,
        isVerified: true,
        siren_entreprise: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID #${id} introuvable.`);
    }

    return user;
  }

  async validateUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.isVerified = true;
    return await this.usersRepository.save(user);
  }

  async suspendUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.isVerified = false;
    return await this.usersRepository.save(user);
  }

  async removeUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const countResult = await this.usersRepository.query(
      'SELECT COUNT(*) as cnt FROM transactions WHERE userId = ? OR partnerId = ?',
      [id, id]
    );
    const count = parseInt(countResult[0].cnt, 10);
    if (count > 0) {
      throw new BadRequestException('Impossible de supprimer un utilisateur possédant un historique de transactions. Suspendez-le à la place.');
    }
    await this.usersRepository.remove(user);
  }
}

