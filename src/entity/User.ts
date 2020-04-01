import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { UserRole } from './UserRole';
import { Department } from './Department';
import { Post } from './Post';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column()
  userAvatar: string;

  @Column()
  pwdHash: string;

  @OneToOne(type => UserRole)
  @JoinColumn()
  role: UserRole;

  @OneToOne(type => Post)
  @JoinColumn()
  post: Post;

  @OneToOne(type => Department)
  @JoinColumn()
  department: Department;
}
