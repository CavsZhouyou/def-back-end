import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { PublishEnvironment } from './PublishEnvironment';
import { PublishStatus } from './PublishStatus';
import { PublishType } from './PublishType';
import { User } from './User';
import { Log } from './Log';
import { Iteration } from './Iteration';
import { Review } from './Review';

@Entity()
export class Publish {
  @PrimaryGeneratedColumn()
  publishId: number;

  @Column()
  createTime: string;

  @Column()
  commit: string;

  @OneToOne(
    type => Log,
    log => log.publish
  )
  @JoinColumn()
  log: Log;

  @OneToOne(type => PublishEnvironment)
  @JoinColumn()
  publishEnvironment: PublishEnvironment;

  @OneToOne(type => PublishStatus)
  @JoinColumn()
  publishStatus: PublishStatus;

  @OneToOne(type => PublishType)
  @JoinColumn()
  publishType: PublishType;

  @ManyToOne(
    type => User,
    user => user.createdPublishes
  )
  publisher: User;

  @OneToOne(
    type => Review,
    review => review.publish
  )
  @JoinColumn()
  review: Review;

  @ManyToOne(
    type => Iteration,
    iteration => iteration.publishes
  )
  iteration: Iteration;
}
