import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Publish } from './Publish';

@Entity()
export class PublishStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(
    type => Publish,
    publish => publish.publishStatus
  )
  publishes: Publish[];
}
