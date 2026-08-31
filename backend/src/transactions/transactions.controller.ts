import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

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