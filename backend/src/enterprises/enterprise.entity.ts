import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('enterprises')
export class Enterprise {
    @PrimaryColumn()
    id: number;

    @Column({ unique: true })
    siren: number;

    @Column({ default: '' })
    apiKey: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'id' })
    user: User;
}
