import { getRepository } from 'typeorm';
import { User } from '@entity/User';
import { Department } from '@entity/Department';
import { Post } from '@entity/Post';
import { UserRole } from '@entity/UserRole';
import { ProductType } from '@entity/ProductType';
import { PublishType } from '@entity/PublishType';

export let userRepository: any;
export let departmentRepository: any;
export let postRepository: any;
export let userRoleRepository: any;
export let productTypeRepository: any;
export let publishTypeRepository: any;

export const initRepository = () => {
  userRepository = getRepository(User);
  departmentRepository = getRepository(Department);
  postRepository = getRepository(Post);
  userRoleRepository = getRepository(UserRole);
  publishTypeRepository = getRepository(PublishType);
  productTypeRepository = getRepository(ProductType);
};
