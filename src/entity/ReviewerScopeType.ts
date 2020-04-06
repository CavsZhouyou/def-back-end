import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CodeReviewSetting } from './CodeReviewSetting';

@Entity()
export class ReviewerScopeType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(
    type => CodeReviewSetting,
    codeReviewSetting => codeReviewSetting.reviewerScope
  )
  settings: CodeReviewSetting[];
}
