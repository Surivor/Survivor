import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('partners')
export class Partner {
   @PrimaryColumn()
   id: number;

   @Column({ unique: true })
   siren: number;

   @Column({ default: '' })
   objet_social: string;

   @OneToOne(() => User)
   @JoinColumn({ name: 'id' })
   user: User;
}

