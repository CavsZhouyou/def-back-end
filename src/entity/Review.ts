import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { ReviewStatus } from './ReviewStatus';
import { Publish } from './Publish';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @Column()
  reviewTitle: string;

  @Column()
  createTime: string;

  @Column()
  failReason: string;

  @OneToOne((type) => Publish, (publish) => publish.review)
  publish: Publish;

  @ManyToOne((type) => User, (user) => user.createdReviews)
  creator: User;

  @ManyToOne((type) => User, (user) => user.reviews)
  reviewer: User;

  @ManyToOne((type) => ReviewStatus, (reviewStatus) => reviewStatus.reviews)
  reviewStatus: ReviewStatus;
}
