import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enterprise } from '../enterprises/enterprise.entity';
import { User } from '../users/user.entity';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class SirhService {
    constructor(
        @InjectRepository(Enterprise)
        private readonly enterprisesRepository: Repository<Enterprise>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly transactionsService: TransactionsService,
    ) {}

    async getEmployees(apiKey: string) {
        const enterprise = await this.enterprisesRepository.findOne({
            where: { apiKey }
        });

        if (!enterprise) {
            throw new UnauthorizedException('Clé API invalide');
        }

        const employees = await this.usersRepository.find({
            where: { siren_entreprise: enterprise.siren, status: 'user' },
            select: {
              id: true,
              name: true,
              firstname: true,
              email: true,
              status: true,
              isVerified: true
            }
        });

        const employeesWithBalance = await Promise.all(
            employees.map(async (emp) => {
                const balanceData = await this.transactionsService.getBalance(emp.id);
                return {
                    id: emp.id,
                    name: emp.name,
                    firstname: emp.firstname,
                    email: emp.email,
                    isVerified: emp.isVerified,
                    balance: balanceData.balance,
                };
            })
        );

        return {
            enterpriseSiren: enterprise.siren,
            totalEmployees: employees.length,
            employees: employeesWithBalance,
        };
    }
}
