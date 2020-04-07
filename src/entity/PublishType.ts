import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { App } from './App';

@Entity()
export class PublishType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  logo: string;

  @OneToMany((type) => App, (app) => app.publishType)
  apps: App[];
}
