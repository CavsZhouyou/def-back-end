/*
 * @Author: zhouyou@werun
 * @Descriptions: 封装一些通用的请求
 * @TodoList: 无
 * @Date: 2020-04-14 17:29:17
 * @Last Modified by: zhouyou@werun
 * @Last Modified time: 2020-04-14 18:16:57
 */
const axios = require('axios');

const gogsHost = 'http://192.168.3.61:10080';
const authToken = '84e6428591e03d2b0b357de58bfb86a98ef2a150';

/**
 * 获取仓库分支列表
 *
 * @param {string} appName 应用名词
 * @returns
 */
export const getBranchesRequest = async (appName: string) => {
  const api = `${gogsHost}/api/v1/repos/${appName}/branches?token=${authToken}`;

  return axios
    .get(api)
    .then((response: any) => {
      const { data } = response;
      const branches: { branchId: string; branchName: string }[] = [];

      // 获取 daily 分支
      data.forEach((item: any) => {
        if (item.name.indexOf('daily') > -1) {
          branches.push({
            branchId: item.name,
            branchName: item.name,
          });
        }
      });

      return branches;
    })
    .catch((error: any) => {
      console.log(error);
    });
};

/**
 * 获取仓库信息
 *
 * @param {string} appName 应用名词
 * @returns
 */
export const getRepositoryRequest = async (appName: string) => {
  const api = `${gogsHost}/api/v1/repos/${appName}?token=${authToken}`;

  return axios
    .get(api)
    .then((response: any) => {
      const { data } = response;
      return data;
    })
    .catch((error: any) => {
      return {};
      // console.log(error);
    });
};
