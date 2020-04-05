import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { IterationStatus } from './IterationStatus';
import { User } from './User';
import { Publish } from './Publish';
import { App } from './App';

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

  @ManyToOne(
    type => User,
    user => user.createdIterations
  )
  creator: User;

  @OneToMany(
    type => Publish,
    publish => publish.iteration
  )
  publishes: Publish[];

  @ManyToOne(
    type => App,
    app => app.iterations
  )
  app: App;
}