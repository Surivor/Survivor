import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., missing fields or email already exists).' })
  @Post('register')
  register(@Body() registerData: CreateUserDto) { 
    return this.authService.register(registerData);
  }

  @ApiOperation({ summary: 'Login and retrieve a JWT token' })
  @ApiBody({ 
    schema: { 
      type: 'object',
      properties: {
        email: { type: 'string', example: 'boutique2@partenaire.fr' },
        password: { type: 'string', example: 'monMotDePasseSecurise' }
      }
    } 
  })
  @ApiResponse({ status: 200, description: 'Successfully logged in. Returns the JWT access token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid email or password.' })
  @Post('login')
  login(@Body() loginData: any/*LoginDto*/) { 
    return this.authService.login(loginData);
  }
}