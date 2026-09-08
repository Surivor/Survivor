import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnterprisesService } from './enterprises.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Enterprises')
@Controller('api/enterprises')
export class EnterprisesController {
    constructor(private readonly enterprisesService: EnterprisesService) {}

    @ApiOperation({ summary: 'Retrieve all enterprises' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get()
    findAll() {
        return this.enterprisesService.findAll();
    }

    @ApiOperation({ summary: 'Get an enterprise by ID' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.enterprisesService.findOne(+id);
    }

    @ApiOperation({ summary: 'Create a new enterprise' })
    @Post()
    create(@Body() enterpriseData: CreateEnterpriseDto) {
        return this.enterprisesService.create(enterpriseData);
    }

    @ApiOperation({ summary: 'Update an existing enterprise' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: UpdateEnterpriseDto) {
        return this.enterprisesService.update(+id, updateData);
    }

    @ApiOperation({ summary: 'Validate an enterprise account' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch(':id/validate')
    validateEnterprise(@Param('id') id: string) {
        return this.enterprisesService.validateEnterprise(+id);
    }

    @ApiOperation({ summary: 'Suspend an enterprise account' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch(':id/suspend')
    suspendEnterprise(@Param('id') id: string) {
        return this.enterprisesService.suspendEnterprise(+id);
    }

    @ApiOperation({ summary: 'Delete an enterprise account' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete(':id')
    removeEnterprise(@Param('id') id: string) {
        return this.enterprisesService.removeEnterprise(+id);
    }
}
