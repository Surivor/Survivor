// partner service (class used in the API)

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// User
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';
// Partner
import { Partner } from './partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
    constructor(
	@InjectRepository(Partner)
	private partnersRepository: Repository<Partner>,
	private usersService: UsersService,
    ) {}

    findAll(): Promise<Partner[]> {
	return this.partnersRepository.find();
    }

    async findBySiren(siren: number): Promise<Partner | null> {
	return this.partnersRepository.findOneBy({ siren });
    }

    /** create a user & partner entry in the db */
    async create(partnerData: CreatePartnerDto): Promise<Partial<Partner>> {

	if (!partnerData.siren || !partnerData.objet_social) {
	    throw new BadRequestException('SIREN and objet social are required');
	}

	//create user
	let newUser = await this.usersService.create(partnerData.userdto);

	console.log("new user id: " + newUser.id);

	const newPartner = this.partnersRepository.create({
	    id: newUser.id,
	    siren: partnerData.siren,
	    objet_social: partnerData.objet_social,
	})

	await this.partnersRepository.save(newPartner)

	return {
	    siren: newPartner.siren,
	    objet_social: newPartner.objet_social,
	};
    }

    /** update a user & partner entry in the db */
    async update(id: number, updateData: UpdatePartnerDto): Promise<Partner> {
	const partner = await this.partnersRepository.findOneBy({ id });

	if (!partner) {
	    throw new NotFoundException(`Partner with ID ${id} not found`);
	}

	const updatedUser = this.partnersRepository.merge(partner, updateData);

	return await this.partnersRepository.save(updatedUser);
    }
}

