import { Entity, Column } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('partners')
export class Partner {
   @PrimaryColumn()
   id: number;

   @Column({ unique: true })
   siren: number;

   @Column({ default: '' })
   objet_social: string;

   @joinColumn({ name: 'id' }) //map primary key as foreign key
   user: User;
}

