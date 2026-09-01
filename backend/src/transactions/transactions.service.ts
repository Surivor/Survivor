import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private jwtService: JwtService,
  ) {}
  
  getBalance() {
    return { balance: 150.00 };
  }

  getHistory() {
    return [
      { id: 1, date: '2026-09-01T12:30:00Z', amount: -15.50, partnerName: 'Boulangerie Paul', type: 'debit' },
      { id: 2, date: '2026-08-31T19:00:00Z', amount: -32.00, partnerName: 'Bistrot du Coin', type: 'debit' },
      { id: 3, date: '2026-08-25T08:00:00Z', amount: 200.00, partnerName: 'Recharge Employeur', type: 'credit' }
    ];
  }

  getQrCode(userId: number) {
    const payload = { sub: userId, purpose: 'payment_qrcode' };
    const token = this.jwtService.sign(payload, { expiresIn: '30m' });
    return { code: token };
  }

  async create(userId: number, amount: number, partnerId: number) {
    const newTransaction = this.transactionRepo.create({
      userId: userId,
      amount: amount,
      partnerId: partnerId,
    });

    await this.transactionRepo.save(newTransaction);

    return {
      success: true,
      message:  `Transaction ${amount} stored`,
      data: newTransaction
    };
  }
}

