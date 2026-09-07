import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Partner } from './partner.entity';

@Entity('featured_partner_history')
export class FeaturedPartnerHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partnerId: number;

  @ManyToOne(() => Partner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column()
  featured: boolean;

  @CreateDateColumn()
  changedAt: Date;

  @Column({ nullable: true })
  changedByAdminId: number;
}
