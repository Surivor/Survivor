import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn,} from 'typeorm';

import { User } from '../../users/user.entity';
import { Partner } from '../../partners/partner.entity';

export enum TransactionType {
    CREDIT = 'credit',
    DEBIT = 'debit',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    partnerId?: number | null;

    @ManyToOne(() => Partner, { nullable: true })
    @JoinColumn({ name: 'partnerId' })
    partner?: Partner | null;

    @Column({
      type: 'enum',
      enum: TransactionType,
    })
    type: TransactionType;

    @Column('decimal', {
      precision: 10,
      scale: 2,
    })
    amount: number;

    @Column({ unique: true, nullable: true })
    idempotencyKey?: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    qrJti?: string;

    @CreateDateColumn()
    createdAt: Date;
}