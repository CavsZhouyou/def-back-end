import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { PublishEnvironment } from './PublishEnvironment';
import { PublishStatus } from './PublishStatus';
import { User } from './User';
import { Log } from './Log';
import { Iteration } from './Iteration';
import { Review } from './Review';
import { App } from './App';

@Entity()
export class Publish {
  @PrimaryGeneratedColumn()
  publishId: number;

  @Column()
  createTime: string;

  @Column()
  commit: string;

  @OneToOne((type) => Log, (log) => log.publish, {
    cascade: true,
  })
  @JoinColumn()
  log: Log;

  @OneToOne((type) => Review, (review) => review.publish, {
    cascade: true,
  })
  @JoinColumn()
  review: Review;

  @ManyToOne(
    (type) => PublishEnvironment,
    (publishEnvironment) => publishEnvironment.publishes
  )
  publishEnvironment: PublishEnvironment;

  @ManyToOne(
    (type) => PublishStatus,
    (publishStatus) => publishStatus.publishes
  )
  publishStatus: PublishStatus;

  @ManyToOne((type) => User, (user) => user.createdPublishes)
  publisher: User;

  @ManyToOne((type) => Iteration, (iteration) => iteration.publishes)
  iteration: Iteration;

  @ManyToOne((type) => App, (app) => app.publishes)
  app: App;
}
