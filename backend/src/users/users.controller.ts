import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards, UnauthorizedException, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getAllUsers(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('isVerified') isVerified?: string,
  ) {
    return this.usersService.findAllAdmin(search, status, isVerified);
  }

  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'Returns a list of all users.' })
  @UseGuards(AuthGuard('jwt'), AdminGuard)
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
  @UseGuards(AuthGuard('jwt'))
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
  async getProfileMe(@Req() req: Request) {
    const userPayload = (req as any).user;
    
    const userId = userPayload?.sub || userPayload?.userId || userPayload?.id;

    if (!userId) {
      throw new UnauthorizedException('Can\'t load id');
    }

    return this.usersService.getProfileInfo(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get('by-status/:status')
  async findByStatus(@Param('status') status: string) {
    return this.usersService.findByStatus(status);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfileInfoByID(id);
  }

  @ApiOperation({ summary: 'Validate a user account' })
  @ApiParam({ name: 'id', description: 'The ID of the user to validate', type: 'string' })
  @ApiResponse({ status: 200, description: 'The user has been successfully validated.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Patch(':id/validate')
  validateUser(@Param('id') id: string) {
    return this.usersService.validateUser(+id);
  }

  @ApiOperation({ summary: 'Suspend a user account' })
  @ApiParam({ name: 'id', description: 'The ID of the user to suspend', type: 'string' })
  @ApiResponse({ status: 200, description: 'The user has been successfully suspended.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Patch(':id/suspend')
  suspendUser(@Param('id') id: string) {
    return this.usersService.suspendUser(+id);
  }

  @ApiOperation({ summary: 'Delete a user account' })
  @ApiParam({ name: 'id', description: 'The ID of the user to delete', type: 'string' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}