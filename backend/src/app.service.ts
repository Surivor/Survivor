import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './partners/partner.entity';
import { User } from './users/user.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class PartnersInitService implements OnModuleInit {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    //const count = await this.partnerRepository.count();
    //if (count === 0) {
    //  const defaultPartners = [
    //    { name: 'Poney Dream 78', siren: 780001112, objet_social: 'Club de poney et team building' },
    //    { name: 'KostumParty', siren: 750112223, objet_social: 'Magasin de déguisements à Paris 11e' },
    //    { name: 'Glaces Artisanales Corrèze', siren: 190003334, objet_social: 'Glacier en ligne et click & collect' },
    //    { name: 'Chapelier Fontaine', siren: 310004445, objet_social: 'Vente de chapeaux en feutre à Toulouse' },
    //  ];
//
    //  for (const p of defaultPartners) {
    //    const user = this.userRepository.create({
    //      name: p.name,
    //      email: `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jeb.fr`,
    //      password: 'securepassword',
    //      status: 'active',
    //    });
    //    const savedUser = await this.userRepository.save(user);
//
    //    const partner = this.partnerRepository.create({
    //      id: savedUser.id,
    //      siren: p.siren,
    //      objet_social: p.objet_social,
    //    });
    //    await this.partnerRepository.save(partner);
    //  }
    //  console.log('Partenaires officiels JEB initialisés avec succès !');
    //}
  }
}