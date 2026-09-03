import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PassportModule } from '@nestjs/passport';
import { Transaction } from './entities/transaction.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';


@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Transaction]),
    User,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
              global: true,
              secret: configService.get<string>('JWT_SECRET_TRANSACTION', 'DONT/ASK8FORTHEKEY!!!'),
              signOptions: { expiresIn: '1d' },
        }),
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}