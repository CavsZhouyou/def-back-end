import { getRepository } from 'typeorm';
import { User } from '@entity/User';
import { Department } from '@entity/Department';
import { Post } from '@entity/Post';
import { UserRole } from '@entity/UserRole';
import { ProductType } from '@entity/ProductType';
import { PublishType } from '@entity/PublishType';
import { App } from '@entity/App';
import { CodeReviewSetting } from '@entity/CodeReviewSetting';
import { ReviewerScopeType } from '@entity/ReviewerScopeType';
import { IterationStatus } from '@entity/IterationStatus';
import { Iteration } from '@entity/Iteration';

export let userRepository: any;
export let departmentRepository: any;
export let postRepository: any;
export let userRoleRepository: any;
export let productTypeRepository: any;
export let publishTypeRepository: any;
export let appRepository: any;
export let codeReviewSettingRepository: any;
export let reviewerScopeTypeRepository: any;
export let iterationStatusRepository: any;
export let iterationRepository: any;

export const initRepository = () => {
  userRepository = getRepository(User);
  departmentRepository = getRepository(Department);
  postRepository = getRepository(Post);
  userRoleRepository = getRepository(UserRole);
  publishTypeRepository = getRepository(PublishType);
  productTypeRepository = getRepository(ProductType);
  appRepository = getRepository(App);
  codeReviewSettingRepository = getRepository(CodeReviewSetting);
  reviewerScopeTypeRepository = getRepository(ReviewerScopeType);
  iterationStatusRepository = getRepository(IterationStatus);
  iterationRepository = getRepository(Iteration);
};
