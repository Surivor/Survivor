import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/transactions') 
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('balance')
  getBalance() {
    return this.transactionsService.getBalance();
  }

  @Get('history')
  getHistory() {
    return this.transactionsService.getHistory();
  }

  @Get('qrcode')
  getQrCode() {
    return this.transactionsService.getQrCode();
  }
}