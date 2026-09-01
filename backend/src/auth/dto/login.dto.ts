import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email required' })
  @IsNotEmpty({ message: 'Email required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password required' })
  password: string;
}