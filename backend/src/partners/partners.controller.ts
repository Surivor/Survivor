import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Partners')
@Controller('api/partners')
export class PartnersController {
    constructor(private readonly partnersService: PartnersService) {}

    @ApiOperation({ summary: 'Retrieve all partners' })
    @ApiResponse({ status: 200, description: 'Returns a list of all official partners.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get()
    findAll() {
        return this.partnersService.findAll();
    }

    @ApiOperation({ summary: 'Find a partner by SIREN' })
    @ApiParam({ name: 'siren', description: 'The SIREN number of the partner', type: 'number' })
    @ApiResponse({ status: 200, description: 'Returns the partner matching the provided SIREN.' })
    @ApiResponse({ status: 404, description: 'Partner not found.' })
    @Get('siren/:siren')
    find(@Param('siren') siren: number) {
        return this.partnersService.findBySiren(+siren);
    }

    @ApiOperation({ summary: 'Retrieve all featured partners' })
    @ApiResponse({ status: 200, description: 'Returns list of all featured partners' })
    @Get('featured')
    getFeatured() {
        return this.partnersService.getFeatured();
    }

    @ApiOperation({ summary: 'Retrieve all verified partners' })
    @ApiResponse({ status: 200, description: 'Returns list of all verified partners' })
    @Get('verified')
    getVerified() {
        return this.partnersService.getVerified();
    }

    @ApiOperation({ summary: 'Get a partner by ID' })
    @ApiParam({ name: 'id', description: 'The ID of the partner', type: 'string' })
    @ApiResponse({ status: 200, description: 'Returns the partner details.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.partnersService.findOne(+id);
    }

    @ApiOperation({ summary: 'Create a new partner' })
    @ApiResponse({ status: 201, description: 'The partner has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request (e.g., invalid SIREN or missing fields).' })
    @Post()
    create(@Body() partnerData: CreatePartnerDto) {
        return this.partnersService.create(partnerData);
    }

    @ApiOperation({ summary: 'Update an existing partner' })
    @ApiParam({ name: 'id', description: 'The ID of the partner to update', type: 'string' })
    @ApiResponse({ status: 200, description: 'The partner has been successfully updated.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: UpdatePartnerDto) {
        return this.partnersService.update(+id, updateData);
    }

    @ApiOperation({ summary: 'Validate a partner account' })
    @ApiParam({ name: 'id', description: 'The ID of the partner to validate', type: 'string' })
    @ApiResponse({ status: 200, description: 'The partner has been successfully validated.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch(':id/validate')
    validatePartner(@Param('id') id: string) {
        return this.partnersService.validatePartner(+id);
    }

    @ApiOperation({ summary: 'Suspend a partner account' })
    @ApiParam({ name: 'id', description: 'The ID of the partner to suspend', type: 'string' })
    @ApiResponse({ status: 200, description: 'The partner has been successfully suspended.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch(':id/suspend')
    suspendPartner(@Param('id') id: string) {
        return this.partnersService.suspendPartner(+id);
    }

    @ApiOperation({ summary: 'Delete a partner account' })
    @ApiParam({ name: 'id', description: 'The ID of the partner to delete', type: 'string' })
    @ApiResponse({ status: 200, description: 'The partner has been successfully deleted.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete(':id')
    removePartner(@Param('id') id: string) {
        return this.partnersService.removePartner(+id);
    }
}

