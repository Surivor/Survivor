import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/user.entity';
import { Partner } from '../partners/partner.entity';
import { TransactionType } from './entities/transaction.entity';
import { randomUUID } from 'crypto';
import { NotificationsService } from '../notification/notification.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
    private dataSource: DataSource
  ) {}

  async processPayment(qrCodeToken: string, amount: number, partnerId: number, idempotencyKey: string) {
    if (amount <= 0 || !Number.isFinite(amount)) {
      throw new BadRequestException('Le montant doit être supérieur à 0 et valide');
    }

    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency key manquante');
    }

    let payload;
    try {
      payload = this.jwtService.verify(qrCodeToken);
    } catch {
      throw new UnauthorizedException('QR Code invalide ou expiré');
    }

    if (payload.purpose !== 'payment_qrcode' || !payload.jti) {
      throw new BadRequestException('QR Code invalide');
    }

    const userId = payload.sub;
    const qrJti = payload.jti;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    
    try {
      const user = await queryRunner.manager
      .getRepository(User)
      .createQueryBuilder('user')
      .setLock('pessimistic_write')
      .where('user.id = :userId', { userId })
      .getOne();
      
      if (!user) {
        throw new BadRequestException('Utilisateur introuvable');
      }
      
      if (user.status !== 'user' || !user.isVerified) {
        throw new BadRequestException('Le compte n\'est pas un salarié valide');
      }

      
      const partner = await queryRunner.manager.findOne(Partner, {
        where: { id: partnerId },
        relations: { user: true }
      });
      
      if (!partner || !partner.verified) {
        throw new BadRequestException('Partenaire invalide ou non vérifié');
      }
      
      const existing = await queryRunner.manager.findOne(Transaction, {
        where: { idempotencyKey },
      });
      
      
      if (existing) {
        await queryRunner.commitTransaction();
        
        return {
          success: true,
          message: 'Transaction déjà traitée',
          transaction: existing,
        };
      }
      
      const existingQr = await queryRunner.manager.findOne(Transaction, {
        where: { qrJti },
      });
      
      if (existingQr) {
        throw new ConflictException('QR Code déjà utilisé');
      }
      
      const creditsResult = await queryRunner.manager
        .createQueryBuilder(Transaction, 't')
        .select('COALESCE(SUM(t.amount), 0)', 'total')
        .where('t.userId = :userId', { userId })
        .andWhere('t.type = :type', { type: TransactionType.CREDIT })
        .getRawOne();

      const debitsResult = await queryRunner.manager
        .createQueryBuilder(Transaction, 't')
        .select('COALESCE(SUM(t.amount), 0)', 'total')
        .where('t.userId = :userId', { userId })
        .andWhere('t.type = :type', { type: TransactionType.DEBIT })
        .getRawOne();

      const credits = Number(creditsResult.total);
      const debits = Number(debitsResult.total);

      const balance = credits - debits;
      const newBalance = balance - amount;

      if (newBalance < 0) {
        throw new BadRequestException('La limite de 0€ serait dépassée');
      }

      const transaction = queryRunner.manager.create(Transaction, {
        userId,
        partnerId,
        amount,
        type: TransactionType.DEBIT,
        idempotencyKey,
        qrJti,
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      const transactionPayload = {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        userId: transaction.userId,
        partnerId: transaction.partnerId,
        qrJti: transaction.qrJti,
        idempotencyKey: transaction.idempotencyKey,
        balanceAfter: newBalance,
        partner: {
          id: partner.id,
          name: partner.user?.name || 'Partenaire Inconnu'
        }
      };

      this.notificationsService.sendBalanceUpdate(userId, newBalance, transactionPayload);

      return {
        success: true,
        transaction,
        previousBalance: balance,
        remainingBalance: newBalance,
        overdraftUsed: newBalance < 0 ? Math.abs(newBalance) : 0,
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      const err = error as any;

      if (err instanceof BadRequestException || err instanceof UnauthorizedException || err instanceof ConflictException) {
        throw err;
      }

      const isDuplicate = err.code === '23505' || err.code === 'ER_DUP_ENTRY' || err.errno === 1062;
      const errorMessage = err.message || err.sqlMessage || '';
      
      if (isDuplicate && (err.constraint?.includes('qrJti') || errorMessage.includes('qrJti'))) {
        throw new BadRequestException('QR Code déjà utilisé');
      }

      if (isDuplicate && (err.constraint?.includes('idempotencyKey') || errorMessage.includes('idempotencyKey'))) {
        const existingTx = await this.transactionRepo.findOne({ where: { idempotencyKey } });
        if (existingTx) {
            return {
                success: true,
                message: 'Transaction déjà traitée',
                transaction: existingTx,
            };
        }
        throw new ConflictException('Erreur de traitement de la requête');
      }

      const isDeadlock = err.code === '40001' || err.code === 'ER_LOCK_DEADLOCK' || err.errno === 1213 || err.code === 'ER_LOCK_WAIT_TIMEOUT' || err.errno === 1205;
      if (isDeadlock) {
        throw new ConflictException('Erreur de concurrence, veuillez réessayer');
      }

      throw new BadRequestException('Erreur interne lors du traitement de la transaction');
    } finally {
      await queryRunner.release();
    }
  }

  async getBalance(userId: number) {
    const creditsResult = await this.transactionRepo
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.CREDIT })
      .getRawOne();

    const debitsResult = await this.transactionRepo
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.DEBIT })
      .getRawOne();

    const credits = Number(creditsResult.total ?? 0);
    const debits = Number(debitsResult.total ?? 0);

    return {
      balance: credits - debits,
    };
  }

  async getHistory(userId: number) {
    const transactions = await this.transactionRepo.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
      relations: { partner: { user: true } },
    });

    let runningBalance = (await this.getBalance(userId)).balance;

    const result = transactions.map(t => {
      const balanceAfter = runningBalance;
      if (t.type === TransactionType.CREDIT) {
        runningBalance -= Number(t.amount);
      } else {
        runningBalance += Number(t.amount);
      }
      
      const partnerData = t.partner ? {
        id: t.partner.id,
        name: t.partner.user?.name || 'Partenaire Inconnu'
      } : undefined;

      return {
        id: t.id,
        type: t.type,
        amount: t.amount,
        createdAt: t.createdAt,
        userId: t.userId,
        partnerId: t.partnerId,
        qrJti: t.qrJti,
        idempotencyKey: t.idempotencyKey,
        balanceAfter,
        partner: partnerData,
      };
    });

    return result;
  }

  async getPartnerHistory(userId: number) {
    const partner = await this.transactionRepo.manager.findOne(Partner, {
      where: { id: userId },
    });

    if (!partner || !partner.verified) {
      throw new BadRequestException('Partenaire invalide ou non vérifié');
    }

    const transactions = await this.transactionRepo.find({
      where: { partnerId: partner.id, type: TransactionType.DEBIT },
      order: { createdAt: 'DESC' },
    });

    return transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      createdAt: t.createdAt,
      type: t.type,
      userId: t.userId,
    }));
  }

  async getAllAdmin() {
    const transactions = await this.transactionRepo.find({
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
        partner: { user: true },
      },
    });

    return transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      createdAt: t.createdAt,
      type: t.type,
      user: t.user ? {
        id: t.user.id,
        name: t.user.name,
        firstname: t.user.firstname,
        email: t.user.email,
      } : null,
      partner: t.partner ? {
        id: t.partner.id,
        name: t.partner.user?.name || 'Partenaire Inconnu',
      } : null,
    }));
  }

  getQrCode(userId: number) {
    const payload = { sub: userId, purpose: 'payment_qrcode', jti: randomUUID() };
    const token = this.jwtService.sign(payload, { expiresIn: '5m' });
    return { code: token };
  }

  async addFunds(userId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Le montant doit être positif');
    }

    const transaction = this.transactionRepo.create({
      userId,
      amount,
      type: TransactionType.CREDIT,
      partnerId: null,
    });

    await this.transactionRepo.save(transaction);

    const { balance } = await this.getBalance(userId);

    return {
      success: true,
      transaction,
      balance,
    };
  }
}
