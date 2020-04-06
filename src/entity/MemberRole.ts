import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Member } from './Member';

@Entity()
export class MemberRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: string;

  @Column()
  roleName: string;

  @OneToMany(
    type => Member,
    member => member.role
  )
  members: Member[];
}
