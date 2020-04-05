import { getRepository } from 'typeorm';
import { User } from '@entity/User';
import { Department } from '@entity/Department';
import { Post } from '@entity/Post';

export let userRepository: any;
export let departmentRepository: any;
export let postRepository: any;

export const initRepository = () => {
  userRepository = getRepository(User);
  departmentRepository = getRepository(Department);
  postRepository = getRepository(Post);
};
