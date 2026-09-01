import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
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
  getQrCode(@Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.transactionsService.getQrCode(userId);
  }

  @Post('transactions')
  createTransaction(@Req() req: Request, @Body() body: { amount: number, partnerId: number }) {
    const userId = (req as any).user.userId;
    return this.transactionsService.create(userId, body.amount, body.partnerId);
  }
}