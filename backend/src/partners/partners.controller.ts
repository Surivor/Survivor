import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('api/partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @Get('siren')
  find(@Body() siren: number) {
      return this.partnersService.findBySiren(siren);
  }

  @Post()
  create(@Body() partnerData: CreatePartnerDto) {
    return this.partnersService.create(partnerData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdatePartnerDto) {
    return this.partnersService.update(+id, updateData);
  }
}

