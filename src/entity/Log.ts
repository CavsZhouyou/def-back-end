import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Publish } from './Publish';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  logId: number;

  @Column()
  content: string;

  @OneToOne((type) => Publish, (publish) => publish.log)
  publish: Publish;
}
