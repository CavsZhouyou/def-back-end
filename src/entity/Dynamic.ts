import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
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

  @ManyToOne(
    type => User,
    user => user.createdDynamics
  )
  creator: User;

  @ManyToOne(
    type => App,
    app => app.dynamics
  )
  app: App;
}
