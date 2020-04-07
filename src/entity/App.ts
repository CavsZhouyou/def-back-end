import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './User';
import { Member } from './Member';
import { Dynamic } from './Dynamic';
import { Iteration } from './Iteration';
import { PublishType } from './PublishType';
import { ProductType } from './ProductType';
import { CodeReviewSetting } from './CodeReviewSetting';

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
  repository: string;

  @Column()
  onlineAddress: string;

  @Column()
  pagePrefix: string;

  @OneToOne((type) => CodeReviewSetting, {
    cascade: true,
  })
  @JoinColumn()
  codeReviewSetting: CodeReviewSetting;

  @OneToMany((type) => Dynamic, (dynamic) => dynamic.app)
  dynamics: Dynamic[];

  @OneToMany((type) => Member, (member) => member.app)
  members: Member[];

  @OneToMany((type) => Iteration, (iteration) => iteration.app)
  iterations: Iteration[];

  @ManyToOne((type) => User, (user) => user.createdApps)
  creator: User;

  @ManyToOne((type) => PublishType, (publishType) => publishType.apps)
  publishType: PublishType;

  @ManyToOne((type) => ProductType, (productType) => productType.apps)
  productType: ProductType;
}
