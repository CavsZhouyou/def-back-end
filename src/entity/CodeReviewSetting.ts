import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ReviewerScopeType } from './ReviewerScopeType';

@Entity()
export class CodeReviewSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isOpen: boolean;

  @ManyToOne(
    type => ReviewerScopeType,
    reviewerScopeType => reviewerScopeType.settings
  )
  reviewerScope: ReviewerScopeType;
}
