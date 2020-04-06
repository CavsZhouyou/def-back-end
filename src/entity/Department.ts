import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departmentId: string;

  @Column()
  departmentName: string;

  @OneToMany(
    type => User,
    user => user.department
  )
  users: User[];
}
