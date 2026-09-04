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

  async processPayment(qrCodeToken: string, amount: number, partnerId: number, idempotencyKey: string) {
    const existingTransaction = await this.transactionRepo.findOne({
      where: { idempotencyKey }
    });

    if (existingTransaction) {
      return {
        success: true,
        message: `Transaction déjà traitée`,
        transaction: existingTransaction
      };
    }

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
    const { balance } = await this.getBalance(userId);

    if (balance < amount) {
      throw new BadRequestException('Solde insuffisant pour effectuer ce paiement');
    }

    const newTransaction = this.transactionRepo.create({
      userId: userId,
      amount: amount,
      partnerId: partnerId,
      idempotencyKey: idempotencyKey
    });

    await this.transactionRepo.save(newTransaction);

    return {
      success: true,
      message: `Transaction effectuée : -${amount}`,
      transaction: newTransaction
    };
  }

  async getBalance(userId: number) {

    const creditsResult = await this.transactionRepo
      .createQueryBuilder("t")
      .select("SUM(t.amount)", "total")
      .where("t.userId = :userId AND t.partnerId IS NULL", { userId })
      .getRawOne();

    const debitsResult = await this.transactionRepo
      .createQueryBuilder("t")
      .select("SUM(t.amount)", "total")
      .where("t.userId = :userId AND t.partnerId IS NOT NULL", { userId })
      .getRawOne();

    const totalCredits = creditsResult.total ? parseFloat(creditsResult.total) : 0;
    const totalDebits = debitsResult.total ? parseFloat(debitsResult.total) : 0;

    return { balance: totalCredits - totalDebits };
  }

  async getHistory(userId: number) {
    return await this.transactionRepo.find({
      where: { userId: userId },
      order: { id: 'DESC' }
    });
  }

  getQrCode(userId: number) {
    const payload = { sub: userId, purpose: 'payment_qrcode' };
    const token = this.jwtService.sign(payload, { expiresIn: '5m' });
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
      message: `Transaction ${amount} stocked`,
      data: newTransaction
    };
  }

  async addFunds(userId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException("Le montant doit être positif");
    }

    const newTransaction = this.transactionRepo.create({
      userId: userId,
      amount: amount,
    });

    await this.transactionRepo.save(newTransaction);

    return {
      success: true,
      message: `Compte du user ${userId} rechargé de ${amount}€`,
      transaction: newTransaction
    };
  }
}