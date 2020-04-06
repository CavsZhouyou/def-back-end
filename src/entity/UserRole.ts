import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: string;

  @Column()
  roleName: string;

  @OneToMany(
    type => User,
    user => user.role
  )
  users: User[];
}
