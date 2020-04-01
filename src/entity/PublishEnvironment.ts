import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PublishEnvironment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;
}
