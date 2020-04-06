import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Iteration } from './Iteration';

@Entity()
export class IterationStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(
    type => Iteration,
    iteration => iteration.iterationStatus
  )
  iterations: Iteration[];
}
