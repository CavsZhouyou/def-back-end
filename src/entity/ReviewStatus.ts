import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ReviewStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;
}
