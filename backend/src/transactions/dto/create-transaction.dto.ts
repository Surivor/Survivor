import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    qrCodeToken: string;

    @IsNumber()
    @IsPositive()
    amount: number;
}
