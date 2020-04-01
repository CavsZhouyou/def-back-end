import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PublishType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;
}
