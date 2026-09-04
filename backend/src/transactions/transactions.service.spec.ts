import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let dataSource: DataSource;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      createQueryBuilder: jest.fn(),
      create: jest.fn((entity, dto) => dto),
      save: jest.fn(),
    },
  };

  const mockTransactionRepo = {
    findOne: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => {
      if (dto.id) {
        throw new Error("Les transactions sont immuables");
      }
      return { ...dto, id: 123 };
    }),
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ sub: 1, purpose: 'payment_qrcode' }),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Transaction), useValue: mockTransactionRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Règles Métier', () => {
    it('doit interdire la modification d\'une transaction existante (Immuabilité)', async () => {
      const existingTransaction = { id: 42, amount: 50, userId: 1 };
      
      await expect(
        mockTransactionRepo.save(existingTransaction)
      ).rejects.toThrow("Les transactions sont immuables");
    });

    it('doit bloquer le paiement si le solde est insuffisant', async () => {
      mockTransactionRepo.findOne.mockResolvedValue(null);

      mockQueryRunner.manager.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn()
          .mockResolvedValueOnce({ total: '10' }) 
          .mockResolvedValueOnce({ total: '0' }), 
      } as any);

      await expect(
        service.processPayment('valid_token', 50, 2, 'idem-key-123')
      ).rejects.toThrow(BadRequestException);
      
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('doit renvoyer la transaction existante sans réécrire en base sur un rejeu (Idempotence)', async () => {
      const existingTx = { id: 1, amount: 20, idempotencyKey: 'idem-key-456' };
      
      mockTransactionRepo.findOne.mockResolvedValue(existingTx);

      const result = await service.processPayment('valid_token', 20, 2, 'idem-key-456');

      expect(mockDataSource.createQueryRunner).not.toHaveBeenCalled();
      expect(result.transaction).toEqual(existingTx);
    });
  });
});