import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {

    @ApiProperty({
	example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInB1cnBvc2UiOiJwYXltZW50X3FyY29kZSIsImp0aSI6IjRiNmUwNTcxLThkNGQtNDE4ZC04Zjc5LWQ1Njc0MmRlMTllOSIsImlhdCI6MTc4ODc4MjMwMCwiZXhwIjoxNzg4Nzg0MTAwfQ.h6z7yL1FReECtQx6g8BekK2c_pFG6p3IWEtDy-socyw',
	description: 'Token acquired from copying a transaction QR code of the account that you want to take money from',
    })
    @IsString()
    @IsNotEmpty()
    qrCodeToken: string;

    @ApiProperty({
	example: '25',
	description: 'Amount of money to take'
    })
    @IsNumber()
    @IsPositive()
    amount: number;
}
