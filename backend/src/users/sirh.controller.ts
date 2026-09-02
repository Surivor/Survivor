import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from './users.service';

@ApiTags('SIRH Integration')
@Controller('api/v1/employees')
export class SirhController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService
  ) {}

  @ApiOperation({ summary: 'get employed balance' })
  @ApiParam({ name: 'id', type: 'number', description: 'unique ID' })
  @ApiResponse({
    status: 200,
    description: 'JSON',
    schema: {
      example: {
        employeeId: 42,
        balance: 150.50,
        currency: 'EUR',
        lastUpdated: '2026-09-02T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'usage defined for an undefnied user',
    schema: {
      example: {
        statusCode: 404,
        message: 'Employ not find',
        error: 'Not Found'
      }
    }
  })
  @Get(':id/balance')
  async getEmployeeBalanceForSirh(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Employ not find');
    }

    const balanceData = await this.transactionsService.getBalance(id);

    return {
      employeeId: id,
      balance: balanceData.balance,
      currency: 'EUR',
      lastUpdated: new Date().toISOString()
    };
  }
}