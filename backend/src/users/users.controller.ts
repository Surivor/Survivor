import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'Returns a list of all users.' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., missing required fields).' })
  @Post()
  create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', description: 'The ID of the user to update', type: 'string' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    return this.usersService.update(+id, updateData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the profile of a user' })
  @ApiResponse({
    status: 200,
    description: 'User information',
    schema: { example: { name: 'Dupont', firstname: 'Jean', address: '12 rue de la Paix', status: 'active' } }
  })


  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req: Request) {
    const userPayload = (req as any).user;
    
    const userId = userPayload?.sub || userPayload?.userId || userPayload?.id;

    if (!userId) {
      throw new UnauthorizedException('Can\'t load id');
    }

    return this.usersService.getProfileInfo(userId);
  }
}