import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PassportModule } from '@nestjs/passport';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Transaction])
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}