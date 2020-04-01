import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { IterationStatus } from './IterationStatus';
import { User } from './User';

@Entity()
export class Iteration {
  @PrimaryGeneratedColumn()
  iterationId: number;

  @Column()
  iterationName: string;

  @Column()
  description: string;

  @Column()
  version: string;

  @Column()
  createTime: string;

  @Column()
  endTime: string;

  @Column()
  branch: string;

  @Column()
  master: string;

  @OneToOne(type => IterationStatus)
  @JoinColumn()
  iterationStatus: IterationStatus;

  @OneToOne(type => User)
  @JoinColumn()
  creator: User;

  // latestPublish

  // appId
}
