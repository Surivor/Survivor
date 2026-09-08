import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SirhController } from './sirh.controller';
import { SirhService } from './sirh.service';
import { Enterprise } from '../enterprises/enterprise.entity';
import { User } from '../users/user.entity';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enterprise, User]),
    TransactionsModule
  ],
  controllers: [SirhController],
  providers: [SirhService],
})
export class SirhModule {}
