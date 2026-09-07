import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Partner } from '../partners/partner.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let transactionRepo: any;

  let queryRunnerManagerMock: any;
  let mockQueryRunner: any;

  beforeEach(async () => {
    queryRunnerManagerMock = {
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue({ id: 1, status: 'user', isVerified: true }),
        }),
      }),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      create: jest.fn((entity, dto) => dto),
      save: jest.fn(),
    };

    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: queryRunnerManagerMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            createQueryBuilder: jest.fn(),
            create: jest.fn((dto) => dto),
            save: jest.fn((dto) => dto),
          },
        },
        { 
          provide: JwtService, 
          useValue: { verify: jest.fn(), sign: jest.fn() } 
        },
        { 
          provide: DataSource, 
          useValue: { createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner) } 
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    dataSource = module.get<DataSource>(DataSource);
    jwtService = module.get<JwtService>(JwtService);
    transactionRepo = module.get(getRepositoryToken(Transaction));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupMocks = (
    balance: number,
    userStatus: string = 'user',
    userVerified: boolean = true,
    partnerVerified: boolean = true,
    existingIdempotency: boolean = false,
    existingQr: boolean = false
  ) => {
    (jwtService.verify as jest.Mock).mockReturnValue({ sub: 1, purpose: 'payment_qrcode', jti: 'uuid-123' });

    queryRunnerManagerMock.getRepository().createQueryBuilder().getOne.mockResolvedValue({
      id: 1, status: userStatus, isVerified: userVerified
    });

    queryRunnerManagerMock.findOne.mockImplementation((entity: any, options: any) => {
      if (entity === Partner) {
        return Promise.resolve(partnerVerified !== null ? { id: 2, verified: partnerVerified } : null);
      }
      if (entity === Transaction && options?.where?.idempotencyKey) {
        return Promise.resolve(existingIdempotency ? { id: 99, amount: 10 } : null);
      }
      if (entity === Transaction && options?.where?.qrJti) {
        return Promise.resolve(existingQr ? { id: 100 } : null);
      }
      return Promise.resolve(null);
    });

    const credits = balance > 0 ? balance : 0;
    const debits = balance < 0 ? Math.abs(balance) : 0;
    
    queryRunnerManagerMock.createQueryBuilder.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn()
        .mockResolvedValueOnce({ total: credits })
        .mockResolvedValueOnce({ total: debits }),
    });
  };

  describe('addFunds', () => {
    it('CREDIT +100 => balance +100', async () => {
      transactionRepo.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn()
          .mockResolvedValueOnce({ total: 100 })
          .mockResolvedValueOnce({ total: 0 }),
      });

      const res = await service.addFunds(1, 100);
      expect(res.success).toBe(true);
      expect(res.balance).toBe(100);
      expect(transactionRepo.save).toHaveBeenCalledWith(expect.objectContaining({ type: TransactionType.CREDIT, amount: 100 }));
    });

    it('balance -100, CREDIT 50 => -50', async () => {
      transactionRepo.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn()
          .mockResolvedValueOnce({ total: 50 })
          .mockResolvedValueOnce({ total: 100 }),
      });

      const res = await service.addFunds(1, 50);
      expect(res.balance).toBe(-50);
    });
  });

  describe('processPayment', () => {
    it('balance 0, DEBIT 40 => -40', async () => {
      setupMocks(0);
      const res = await service.processPayment('valid', 40, 2, 'idem-1');
      expect(res.success).toBe(true);
      expect(res.remainingBalance).toBe(-40);
    });

    it('balance -140, DEBIT 10 => -150', async () => {
      setupMocks(-140);
      const res = await service.processPayment('valid', 10, 2, 'idem-2');
      expect(res.remainingBalance).toBe(-150);
    });

    it('balance -150, DEBIT 1 => refus', async () => {
      setupMocks(-150);
      await expect(service.processPayment('valid', 1, 2, 'idem-3')).rejects.toThrow(BadRequestException);
    });

    it('amount 0 => refus', async () => {
      await expect(service.processPayment('valid', 0, 2, 'idem-4')).rejects.toThrow(BadRequestException);
    });

    it('amount negative => refus', async () => {
      await expect(service.processPayment('valid', -10, 2, 'idem-4')).rejects.toThrow(BadRequestException);
    });

    it('Partner non verified => refus', async () => {
      setupMocks(0, 'user', true, false);
      await expect(service.processPayment('valid', 10, 2, 'idem-5')).rejects.toThrow(BadRequestException);
    });

    it('User suspendu => refus', async () => {
      setupMocks(0, 'suspended', true, true);
      await expect(service.processPayment('valid', 10, 2, 'idem-6')).rejects.toThrow(BadRequestException);
    });

    it('même idempotency key x2 => un seul débit', async () => {
      setupMocks(0, 'user', true, true, true);
      const res = await service.processPayment('valid', 10, 2, 'idem-7');
      expect(res.message).toBe('Transaction déjà traitée');
      expect(queryRunnerManagerMock.save).not.toHaveBeenCalled();
    });

    it('même QR avec deux idempotency keys différentes => un seul débit', async () => {
      setupMocks(0, 'user', true, true, false, true);
      await expect(service.processPayment('valid', 10, 2, 'idem-8')).rejects.toThrow(ConflictException);
    });
  });
});
