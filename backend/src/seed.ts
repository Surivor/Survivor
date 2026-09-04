import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Partner } from './partners/partner.entity';
import { Transaction } from './transactions/entities/transaction.entity'; 
import * as fs from 'fs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    
    const userRepository = dataSource.getRepository(User);
    const partnerRepository = dataSource.getRepository(Partner);
    const transactionRepository = dataSource.getRepository(Transaction);
    
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

    await transactionRepository.clear({});
    await partnerRepository.clear({});
    await userRepository.clear({});

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

    const partnersData = [
      { name: 'Poney Dream 78', siren: 780001112, objet_social: 'Club de poney et team building', region: 'IDF', category: 'Loisirs' },
      { name: 'KostumParty', siren: 750112223, objet_social: 'Magasin de déguisements', region: 'IDF', category: 'Boutique' },
      { name: 'Glaces Artisanales Corrèze', siren: 190003334, objet_social: 'Glacier en ligne', region: 'Nouvelle-Aquitaine', category: 'Restauration' },
      { name: 'Chapelier Fontaine', siren: 310004445, objet_social: 'Vente de chapeaux en feutre', region: 'Occitanie', category: 'Boutique' },
      { name: 'Le Bilig de Saint-Malo', siren: 350005556, objet_social: 'Crêperie traditionnelle', region: 'Bretagne', category: 'Restauration' },
      { name: 'Librairie des Capucins', siren: 330006667, objet_social: 'Librairie indépendante', region: 'Nouvelle-Aquitaine', category: 'Culture' },
      { name: 'Théâtre de l\'Éphémère', siren: 750007778, objet_social: 'Salle de spectacle', region: 'IDF', category: 'Culture' },
      { name: 'Kayak & Co', siren: 290008889, objet_social: 'Location de canoës', region: 'Bretagne', category: 'Loisirs' },
      { name: 'L\'Atelier du Cuir', siren: 310009990, objet_social: 'Maroquinerie artisanale', region: 'Occitanie', category: 'Boutique' },
      { name: 'Cinéma Le Méliès', siren: 340001112, objet_social: 'Cinéma d\'art et d\'essai', region: 'Occitanie', category: 'Culture' },
      { name: 'Bistrot de la Baie', siren: 220002223, objet_social: 'Brasserie locale', region: 'Bretagne', category: 'Restauration' },
      { name: 'Escape Game Bordeaux', siren: 330003334, objet_social: 'Jeu d\'évasion', region: 'Nouvelle-Aquitaine', category: 'Loisirs' },
    ];
  
    const firstNames = [
      'Lucas', 'Emma', 'Hugo', 'Chloé', 'Louis', 'Léa', 'Gabriel', 'Manon', 'Jules', 'Camille', 
      'Arthur', 'Louise', 'Raphaël', 'Alice', 'Maël', 'Juliette', 'Mathis', 'Lina', 'Clément', 'Sarah', 
      'Paul', 'Inès', 'Nathan', 'Anaïs', 'Gaspard', 'Romane', 'Tom', 'Célia', 'Victor', 'Lola', 
      'Noah', 'Margaux', 'Antoine', 'Léna', 'Maxime', 'Ambre', 'Ethan', 'Zoé', 'Léon', 'Eva', 
      'Malo', 'Rose', 'Adam', 'Mila', 'Nino', 'Agathe', 'Tiago', 'Jeanne', 'Sacha', 'Julia'
    ];
    const lastNames = [
      'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 
      'Simon', 'Michel', 'Lefevre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard', 
      'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Guillaume', 'Faure', 'Andre', 
      'Mercier', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier', 'Francois', 'Legrand', 'Gauthier', 'Garcia', 
      'Perrin', 'Robin', 'Clement', 'Morin', 'Nicolas', 'Henry', 'Roussel', 'Mathieu', 'Gautier', 'Masson'
    ];
  
    const employeesData = firstNames.map((firstName, index) => {
      let targetProfile = 'standard';
      if (index < 3) targetProfile = 'zero';
      else if (index >= 3 && index < 5) targetProfile = 'under_five';
  
      return {
        firstName,
        lastName: lastNames[index],
        email: `${firstName.toLowerCase()}.${lastNames[index].toLowerCase()}@entreprise.fr`,
        password: 'securepassword',
        targetProfile, 
      };
    });
  
    const savedPartners = [];
    for (const p of partnersData) {
      const user = userRepository.create({
        name: p.name,
        email: `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jeb.fr`,
        password: 'securepassword',
        status: 'partenaire',
      });
      const savedUser = await userRepository.save(user);
  
      const partner = partnerRepository.create({
        id: savedUser.id,
        siren: p.siren,
        objet_social: p.objet_social,
      });
      await partnerRepository.save(partner);
      savedPartners.push(savedUser);
    }
  
    const savedEmployees = [];
    for (const e of employeesData) {
      const employee = userRepository.create({
        name: `${e.firstName} ${e.lastName}`,
        email: e.email,
        password: e.password,
        status: 'user',
      });
      
      const savedUser = await userRepository.save(employee);
      savedEmployees.push({ dbUser: savedUser, targetProfile: e.targetProfile });
    }
  
    const referenceDate = new Date('2026-06-01T00:00:00Z').getTime();
    let csvContent = 'id;date_iso8601;employee_id;partner_id;amount_cents;status\n';
  
    let txId = 1;
    for (let i = 0; i < 200; i++) {
      const emp = savedEmployees[i % 50]; 
      const part = savedPartners[i % 12]; 
      const txDate = new Date(referenceDate + i * 1000 * 60 * 60 * 24);
      const status = i < 5 ? 'refused' : 'validated';
      const amountCents = 1500;
  
      csvContent += `${txId};${txDate.toISOString()};${emp.dbUser.id};${part.id};${amountCents};${status}\n`;
      txId++;
      
    }
  
    fs.writeFileSync('transactions.csv', csvContent, 'utf8');
    console.log('Fichier transactions.csv généré avec succès !');
}

bootstrap();