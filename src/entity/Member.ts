import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { MemberRole } from './MemberRole';
import { App } from './App';
import { User } from './User';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  joinTime: string;

  @Column()
  expiredTime: string;

  @OneToOne(type => MemberRole)
  @JoinColumn()
  role: MemberRole;

  @ManyToOne(
    type => User,
    user => user.joinedApps
  )
  user: User;

  @ManyToOne(
    type => App,
    app => app.members
  )
  app: App;
}
