import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export let userRepository: any;

export const initRepository = () => {
  userRepository = getRepository(User);
};
