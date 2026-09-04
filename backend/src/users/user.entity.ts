import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { Partner } from '../partners/partner.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  password: string;

  @Column()
  name: string;

  @Column({ default: '' })
  firstname: string;

  @Column('decimal', { precision: 10, scale: 2, default: 300 })
  balance_initial: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isVerified: boolean;

  //siren de l'entreprise dans lequelle le user travaille
  //optionnel
  @Column({ default: 0 })
  siren_entreprise: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Partner, (partner) => partner.user)
  partner: Partner;
}
