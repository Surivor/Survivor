import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Partners')
@Controller('api/partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @ApiOperation({ summary: 'Retrieve all partners' })
  @ApiResponse({ status: 200, description: 'Returns a list of all official partners.' })
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
    return this.partnersService.findBySiren(siren);
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdatePartnerDto) {
    return this.partnersService.update(+id, updateData);
  }
}