import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'contact@poneydream78.com',
    description: 'The email address used for login'
  })
  @IsEmail({}, { message: 'Email required' })
  @IsNotEmpty({ message: 'Email required' })
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'The plain text password'
  })
  @IsString()
  @IsNotEmpty({ message: 'Password required' })
  password: string;
}