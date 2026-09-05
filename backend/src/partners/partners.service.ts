// partner service (class used in the API)

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// User
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
// Partner
import { Partner } from './partner.entity';
import { FeaturedPartnerHistory } from './featured-partner-history.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
    constructor(
	@InjectRepository(Partner)
	private partnersRepository: Repository<Partner>,
	@InjectRepository(FeaturedPartnerHistory)
	private historyRepository: Repository<FeaturedPartnerHistory>,
	private usersService: UsersService,
    ) {}

    findAll(): Promise<Partner[]> {
	return this.partnersRepository.find({ relations: { user: true } });
    }

    async findOne(id: number): Promise<Partner> {
	const partner = await this.partnersRepository.findOne({
	    where: { id },
	    relations: { user: true },
	});
	if (!partner) {
	    throw new NotFoundException(`Partner with ID ${id} not found`);
	}
	return partner;
    }

    async findBySiren(siren: number): Promise<Partner | null> {
	return this.partnersRepository.findOne({
	    where: { siren },
	    relations: { user: true },
	});
    }

    async getFeatured(): Promise<Partner[]> {
	return this.partnersRepository.find({
	    where: { featured: true },
	    relations: { user: true },
	});
    }

    async getVerified(): Promise<Partner[]> {
	return this.partnersRepository.find({
	    where: { verified: true },
	    relations: { user: true },
	});
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

	if (updateData.userdto) {
	    await this.usersService.update(id, updateData.userdto);
	}

	const updatedPartner = this.partnersRepository.merge(partner, updateData);

	return await this.partnersRepository.save(updatedPartner);
    }

    async updateFeatured(id: number, featured: boolean, adminId: number): Promise<Partner> {
	const partner = await this.partnersRepository.findOneBy({ id });
	if (!partner) {
	    throw new NotFoundException(`Partner with ID ${id} not found`);
	}

	if (featured) {
	    const currentlyFeatured = await this.partnersRepository.findOneBy({ featured: true });
	    if (currentlyFeatured && currentlyFeatured.id !== id) {
		currentlyFeatured.featured = false;
		currentlyFeatured.unfeaturedAt = new Date();
		await this.partnersRepository.save(currentlyFeatured);
		
		await this.historyRepository.save({
		    partnerId: currentlyFeatured.id,
		    featured: false,
		    changedByAdminId: adminId
		});
	    }
	}

	partner.featured = featured;
	if (featured) {
	    partner.featuredAt = new Date();
	} else {
	    partner.unfeaturedAt = new Date();
	}
	const savedPartner = await this.partnersRepository.save(partner);

	await this.historyRepository.save({
	    partnerId: id,
	    featured: featured,
	    changedByAdminId: adminId
	});

	return savedPartner;
    }

    async validatePartner(id: number): Promise<Partner> {
	const partner = await this.partnersRepository.findOneBy({ id });
	if (!partner) {
	    throw new NotFoundException(`Partner with ID ${id} not found`);
	}
	partner.verified = true;
	await this.usersService.validateUser(id);
	return await this.partnersRepository.save(partner);
    }

    async suspendPartner(id: number): Promise<Partner> {
	const partner = await this.partnersRepository.findOneBy({ id });
	if (!partner) {
	    throw new NotFoundException(`Partner with ID ${id} not found`);
	}
	partner.verified = false;
	try {
	    await this.usersService.suspendUser(id);
	} catch (e) {}
	return await this.partnersRepository.save(partner);
    }

    async removePartner(id: number): Promise<void> {
	const partner = await this.partnersRepository.findOneBy({ id });
	if (!partner) {
	    throw new NotFoundException(`Partner with ID ${id} not found`);
	}
	await this.partnersRepository.remove(partner);
	try {
	    await this.usersService.removeUser(id);
	} catch (e) {}
    }
}


