import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { Partner } from './partner.entity';
import { FeaturedPartnerHistory } from './featured-partner-history.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partner, FeaturedPartnerHistory]),
    UsersModule
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
