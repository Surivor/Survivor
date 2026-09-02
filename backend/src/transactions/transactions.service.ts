import { Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
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
  
  

  async processPayment(qrCodeToken: string, amount: number, partnerId: number) {
    let payload;
    try {
      payload = this.jwtService.verify(qrCodeToken);
    } catch (error) {
      throw new UnauthorizedException('invalid QR Code');
    }

    if (payload.purpose !== 'payment_qrcode') {
      throw new BadRequestException('this QR code can\'t be used to share money');
    }

    const userId = payload.sub;

    const newTransaction = this.transactionRepo.create({
      userId: userId,
      amount: amount,
      partnerId: partnerId,
    });

    await this.transactionRepo.save(newTransaction);

    return {
      success: true,
      message: `Transaction: ${amount}`,
      transaction: newTransaction
    };
  }

  async getBalance(userId: number) {
    const result = await this.transactionRepo
      .createQueryBuilder("transaction")
      .select("SUM(transaction.amount)", "total")
      .where("transaction.userId = :userId", { userId: userId })
      .getRawOne();

    const currentBalance = result.total ? parseFloat(result.total) : 0;

    return { balance: currentBalance };
  }

  async getHistory(userId: number) {
    return await this.transactionRepo.find({
      where: { userId: userId }
    });
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

