import { Controller, Get, Post, Body, Req, Res, UseGuards, UnauthorizedException, Headers, BadRequestException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import * as fs from 'fs';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}


  @ApiOperation({ summary: 'Retrieve employee balance' })
  @ApiResponse({ status: 200, description: 'Returns the current available balance for the authenticated employee.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('balance')
  getBalance(@Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.transactionsService.getBalance(userId);
  }

  @ApiOperation({ summary: 'Retrieve transaction history' })
  @ApiResponse({ status: 200, description: 'Returns an array of past transactions.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('history')
  getHistory(@Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.transactionsService.getHistory(userId);
  }
  @ApiOperation({ summary: 'Generate temporary QR Code token' })
  @ApiResponse({ status: 200, description: 'Returns a 30-minute valid JWT meant to be scanned by a partner.' })
  @ApiResponse({ status: 401, description: 'Unauthorized if the employee session token is missing or invalid.' })
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  createTransaction(
    @Req() req: Request, 
    @Body() body: { amount: number, qrCodeToken: string }
  ) {
    const partnerId = (req as any).user.userId;
    return this.transactionsService.processPayment(body.qrCodeToken, body.amount, partnerId);
  }

  @Post('admin/fund')
  async fundAccount(
    @Body('userId') userId: number,
    @Body('amount') amount: number,
    @Headers('x-api-key') apiKey: string,
  ) {
    if (!apiKey || apiKey !== process.env.PASS_ADD) {
      throw new UnauthorizedException("Clé API invalide ou manquante");
    }

    return this.transactionsService.addFunds(userId, amount);
  }

  @Get('transactions.csv')
  getTransactionsCsv(@Res() res: Response) {
    const file = fs.readFileSync('transactions.csv', 'utf8');
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(file);
  }
}