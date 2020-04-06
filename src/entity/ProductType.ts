import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { App } from './App';

@Entity()
export class ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(
    type => App,
    app => app.productType
  )
  apps: App[];
}
