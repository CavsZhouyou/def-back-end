import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  Column
} from 'typeorm';
import { UserRole } from './UserRole';
import { Department } from './Department';
import { Post } from './Post';
import { App } from './App';
import { Member } from './Member';
import { Publish } from './Publish';
import { Iteration } from './Iteration';

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

  @OneToMany(
    type => App,
    app => app.creator
  )
  createdApps: App[];

  @OneToMany(
    type => Member,
    member => member.user
  )
  joinedApps: Member[];

  @OneToMany(
    type => Publish,
    publish => publish.publisher
  )
  createdPublishes: Publish[];

  @OneToMany(
    type => Iteration,
    iteration => iteration.creator
  )
  createdIterations: Iteration[];
}
