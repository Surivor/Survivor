import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Retrieve employee balance' })
  @ApiResponse({ status: 200, description: 'Returns the current available balance for the authenticated employee.' })
  @Get('balance')
  getBalance() {
    return this.transactionsService.getBalance();
  }

  @ApiOperation({ summary: 'Retrieve transaction history' })
  @ApiResponse({ status: 200, description: 'Returns an array of past transactions (credits and debits).' })
  @Get('history')
  getHistory() {
    return this.transactionsService.getHistory();
  }

  @ApiOperation({ summary: 'Generate temporary QR Code token' })
  @ApiResponse({ status: 200, description: 'Returns a 30-minute valid JWT meant to be scanned by a partner.' })
  @ApiResponse({ status: 401, description: 'Unauthorized if the employee session token is missing or invalid.' })
  @Get('qrcode')
  getQrCode(@Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.transactionsService.getQrCode(userId);
  }

  @ApiOperation({ summary: 'Process a payment from a scanned QR Code' })
  @ApiBody({ 
    schema: { 
      type: 'object',
      properties: {
        amount: { type: 'number', example: 42.50 },
        qrCodeToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    } 
  })
  @ApiResponse({ status: 201, description: 'Payment successfully processed and saved.' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., token not meant for payment).' })
  @ApiResponse({ status: 401, description: 'Unauthorized if the QR Code token is expired or invalid.' })
  @Post('transactions')
  createTransaction(
    @Req() req: Request, 
    @Body() body: { amount: number, qrCodeToken: string }
  ) {
    const partnerId = (req as any).user.userId;
    return this.transactionsService.processPayment(body.qrCodeToken, body.amount, partnerId);
  }
}