import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MemberRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: string;

  @Column()
  roleName: string;
}
