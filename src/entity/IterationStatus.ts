import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class IterationStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;
}
