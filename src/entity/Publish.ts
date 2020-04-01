import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { PublishEnvironment } from './PublishEnvironment';
import { PublishStatus } from './PublishStatus';
import { PublishType } from './PublishType';
import { User } from './User';
import { Log } from './Log';

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
  logData: Log;

  @OneToOne(type => PublishEnvironment)
  @JoinColumn()
  publishEnvironment: PublishEnvironment;

  @OneToOne(type => PublishStatus)
  @JoinColumn()
  publishStatus: PublishStatus;

  @OneToOne(type => PublishType)
  @JoinColumn()
  publishType: PublishType;

  @OneToOne(type => User)
  @JoinColumn()
  publisherId: User;

  // iterationId
}
