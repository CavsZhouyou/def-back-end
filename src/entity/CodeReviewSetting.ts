import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { ReviewerScopeType } from './ReviewerScopeType';

@Entity()
export class CodeReviewSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isOpen: boolean;

  @OneToOne(type => ReviewerScopeType)
  @JoinColumn()
  reviewerScope: ReviewerScopeType;
}
