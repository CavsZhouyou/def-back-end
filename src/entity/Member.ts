import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { MemberRole } from './MemberRole';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  joinTime: string;

  @Column()
  expiredTime: string;

  // 仓库 一对多 成员

  // 成员 一对一 用户

  @OneToOne(type => MemberRole)
  @JoinColumn()
  role: MemberRole;
}
