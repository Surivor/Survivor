import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Enterprise } from './enterprise.entity';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import * as crypto from 'crypto';

@Injectable()
export class EnterprisesService {
    private readonly enterpriseSelect = {
        id: true,
        siren: true,
        apiKey: true,
        user: {
            id: true,
            name: true,
            email: true,
            firstname: true,
            status: true,
            isVerified: true
        }
    };

    constructor(
        @InjectRepository(Enterprise)
        private enterprisesRepository: Repository<Enterprise>,
        private usersService: UsersService,
    ) {}

    findAll(): Promise<Enterprise[]> {
        return this.enterprisesRepository.find({ relations: { user: true }, select: this.enterpriseSelect as any });
    }

    async findOne(id: number): Promise<Enterprise> {
        const enterprise = await this.enterprisesRepository.findOne({
            where: { id },
            relations: { user: true },
            select: this.enterpriseSelect as any,
        });
        if (!enterprise) {
            throw new NotFoundException(`Enterprise with ID ${id} not found`);
        }
        return enterprise;
    }

    async create(enterpriseData: CreateEnterpriseDto): Promise<Partial<Enterprise>> {
        if (!enterpriseData.siren) {
            throw new BadRequestException('SIREN is required');
        }

        let newUser = await this.usersService.create(enterpriseData.userdto);

        const apiKey = crypto.randomBytes(32).toString('hex');

        const newEnterprise = this.enterprisesRepository.create({
            id: newUser.id,
            siren: enterpriseData.siren,
            apiKey: apiKey,
        });

        try {
            await this.enterprisesRepository.save(newEnterprise);
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(`L'entreprise avec ce SIREN existe déjà.`);
            }
            throw error;
        }

        return newEnterprise;
    }

    async update(id: number, updateData: UpdateEnterpriseDto): Promise<Enterprise> {
        const enterprise = await this.enterprisesRepository.findOneBy({ id });

        if (!enterprise) {
            throw new NotFoundException(`Enterprise with ID ${id} not found`);
        }

        if (updateData.userdto) {
            await this.usersService.update(id, updateData.userdto);
        }

        const updatedEnterprise = this.enterprisesRepository.merge(enterprise, updateData);
        return await this.enterprisesRepository.save(updatedEnterprise);
    }

    async validateEnterprise(id: number): Promise<Enterprise> {
        const enterprise = await this.enterprisesRepository.findOneBy({ id });
        if (!enterprise) {
            throw new NotFoundException(`Enterprise with ID ${id} not found`);
        }
        await this.usersService.validateUser(id);
        return enterprise;
    }

    async suspendEnterprise(id: number): Promise<Enterprise> {
        const enterprise = await this.enterprisesRepository.findOneBy({ id });
        if (!enterprise) {
            throw new NotFoundException(`Enterprise with ID ${id} not found`);
        }
        try {
            await this.usersService.suspendUser(id);
        } catch (e) {}
        return enterprise;
    }

    async removeEnterprise(id: number): Promise<void> {
        const enterprise = await this.enterprisesRepository.findOneBy({ id });
        if (!enterprise) {
            throw new NotFoundException(`Enterprise with ID ${id} not found`);
        }
        await this.enterprisesRepository.remove(enterprise);
        try {
            await this.usersService.removeUser(id);
        } catch (e) {}
    }
}
