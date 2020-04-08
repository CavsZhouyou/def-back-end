import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserRole } from './UserRole';
import { Department } from './Department';
import { Post } from './Post';
import { App } from './App';
import { Member } from './Member';
import { Publish } from './Publish';
import { Iteration } from './Iteration';
import { Dynamic } from './Dynamic';
import { Review } from './Review';

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

  @ManyToOne((type) => UserRole, (userRole) => userRole.users)
  role: UserRole;

  @ManyToOne((type) => Post, (post) => post.users)
  post: Post;

  @ManyToOne((type) => Department, (department) => department.users)
  department: Department;

  @OneToMany((type) => App, (app) => app.creator)
  createdApps: App[];

  @OneToMany((type) => Dynamic, (dynamic) => dynamic.creator)
  createdDynamics: Dynamic[];

  @OneToMany((type) => Member, (member) => member.user)
  joinedApps: Member[];

  @OneToMany((type) => Publish, (publish) => publish.publisher)
  createdPublishes: Publish[];

  @OneToMany((type) => Iteration, (iteration) => iteration.creator)
  createdIterations: Iteration[];

  @OneToMany((type) => Review, (review) => review.creator)
  createdReviews: Review[];

  @OneToMany((type) => Review, (review) => review.reviewer)
  reviews: Review[];

  @ManyToMany((type) => Iteration, (iteration) => iteration.participants)
  @JoinTable()
  joinedIteration: Iteration[];
}
