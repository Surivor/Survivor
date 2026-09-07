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

    //pastille du gouv
    @Column({ default: false })
    verified: boolean;

    @Column({ default: false })
    featured: boolean;

    @Column({ type: 'timestamp', nullable: true })
    featuredAt?: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    unfeaturedAt?: Date | null;

    @OneToOne(() => User)
    @JoinColumn({ name: 'id' })
    user: User;
}