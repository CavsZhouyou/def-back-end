import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export let userRepository: any;

export const initRepository = () => {
  userRepository = getRepository(User);
};

// class RepositoryManager {
//   userRepository: any;

//   constructor() {}

//   initRepository() {
//     this.userRepository = getRepository(User);
//   }
// }

// export const repositories = new RepositoryManager();
