import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: string;

  @Column()
  postName: string;

  @OneToMany(
    type => User,
    user => user.post
  )
  users: User[];
}
