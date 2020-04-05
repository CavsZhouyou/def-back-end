import { getRepository } from 'typeorm';
import { User } from '@entity/User';
import { Department } from '@entity/Department';
import { Post } from '@entity/Post';
import { UserRole } from '@entity/UserRole';

export let userRepository: any;
export let departmentRepository: any;
export let postRepository: any;
export let userRoleRepository: any;

export const initRepository = () => {
  userRepository = getRepository(User);
  departmentRepository = getRepository(Department);
  postRepository = getRepository(Post);
  userRoleRepository = getRepository(UserRole);
};
