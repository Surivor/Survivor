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
    verified: boolean

    //government favorites (featured on main page)
    @Column({ default: false })
    featured: boolean

    @OneToOne(() => User)
    @JoinColumn({ name: 'id' })
    user: User;
}

