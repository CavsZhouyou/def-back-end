import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { App } from './App';
import { User } from './User';

@Entity()
export class Dynamic {
  @PrimaryGeneratedColumn()
  dynamicId: number;

  @Column()
  content: string;

  @Column()
  operateTime: string;

  @OneToOne(type => User)
  @JoinColumn()
  creator: User;

  @ManyToOne(
    type => App,
    app => app.dynamics
  )
  app: App;
}
