import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Dupont',
    description: 'The last name or corporate name of the user'
  })
  @IsString()
  @IsNotEmpty({ message: 'Name Required' })
  name: string;

  @ApiProperty({
    example: 'contact@poneydream78.com',
    description: 'The email address used for login'
  })
  @IsEmail({}, { message: 'Email Invalid' })
  @IsNotEmpty({ message: 'Email Required' })
  email: string;

  @ApiPropertyOptional({
    example: 'SecurePassword123!',
    description: 'The plain text password (will be securely hashed)'
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    example: 'Jean-Eudes',
    description: 'The first name of the user'
  })
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'The current status of the user account'
  })
  @IsString()
  @IsOptional()
  status?: string;
}