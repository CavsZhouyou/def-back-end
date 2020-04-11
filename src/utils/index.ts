/*
 * @Author: zhouyou@werun
 * @Descriptions: 定义公用函数
 * @TodoList: 无
 * @Date: 2020-04-09 14:16:46
 * @Last Modified by: zhouyou@werun
 * @Last Modified time: 2020-04-09 14:52:45
 */

import {
  userRepository,
  dynamicRepository,
  appRepository,
} from '@shared/repositories';

/**
 * 新增一条动态信息
 *
 * @param {string} userId
 * @param {number} appId
 * @param {string} content
 */
export const addDynamic = async (
  userId: string,
  appId: number,
  content: string
) => {
  const creator = await userRepository.findOne({ userId });
  const app = await appRepository.findOne({
    appId,
  });
  const operateTime = new Date().getTime();

  const dynamic = dynamicRepository.create({
    creator,
    content,
    operateTime,
    app,
  });

  await dynamicRepository.save(dynamic);
};

export async function asyncForEach(
  array: any[],
  callback: (item: any, index: number, array: any[]) => void
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
