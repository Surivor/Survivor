// partner service (class used in the API)

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// User
import { User } from '../users/user.entity';
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

    async getFeatured(): Promise<Partner[]> {
	return this.partnersRepository.find({
	    where: { featured: true }
	})
    }

    async getVerified(): Promise<Partner[]> {
	return this.partnersRepository.find({
	    where: { verified: true }
	})
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
	    verified: partnerData.verified,
	    featured: partnerData.featured,
	})

	await this.partnersRepository.save(newPartner)

	return newPartner;
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

