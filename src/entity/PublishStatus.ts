import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PublishStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;
}
