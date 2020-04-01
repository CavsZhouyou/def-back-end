import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { User } from './User';
import { ReviewStatus } from './ReviewStatus';

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

  @OneToOne(type => User)
  @JoinColumn()
  creator: User;

  @OneToOne(type => User)
  @JoinColumn()
  reviewer: User;

  @OneToOne(type => ReviewStatus)
  @JoinColumn()
  reviewStatus: ReviewStatus;

  // publishId
}
