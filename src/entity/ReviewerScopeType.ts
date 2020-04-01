import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ReviewerScopeType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;
}
