import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from './Review';

@Entity()
export class ReviewStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(
    type => Review,
    review => review.reviewStatus
  )
  reviews: Review[];
}
