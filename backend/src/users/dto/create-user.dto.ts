import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name Required' })
  name: string;

  @IsEmail({}, { message: 'Email Invalid' })
  @IsNotEmpty({ message: 'Email Required' })
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  status?: string;
}