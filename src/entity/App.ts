import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Column
} from 'typeorm';
import { PublishType } from './PublishType';
import { ProductType } from './ProductType';
import { User } from './User';
import { CodeReviewSetting } from './CodeReviewSetting';
import { Dynamic } from './Dynamic';

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  appId: number;

  @Column()
  appName: string;

  @Column()
  description: string;

  @Column()
  appLogo: string;

  @Column()
  role: string;

  @Column()
  repository: string;

  @Column()
  onlineAddress: string;

  @Column()
  pagePrefix: string;

  @OneToOne(type => PublishType)
  @JoinColumn()
  publishType: PublishType;

  @OneToOne(type => ProductType)
  @JoinColumn()
  productType: ProductType;

  @OneToOne(type => User)
  @JoinColumn()
  creator: User;

  @OneToOne(type => CodeReviewSetting)
  @JoinColumn()
  codeReviewSetting: CodeReviewSetting;

  @OneToMany(
    type => Dynamic,
    dynamic => dynamic.app
  )
  dynamics: Dynamic[];
}
