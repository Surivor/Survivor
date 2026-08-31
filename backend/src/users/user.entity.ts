import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
