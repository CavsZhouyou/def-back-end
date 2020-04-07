/*
 * @Author: zhouyou@werun
 * @Descriptions: 数据库初始化
 * @TodoList: 无
 * @Date: 2020-04-02 20:06:09
 * @Last Modified by: zhouyou@werun
 * @Last Modified time: 2020-04-07 20:44:19
 */

import { PublishType } from '@entity/PublishType';
import { ProductType } from '@entity/ProductType';
import { IterationStatus } from '@entity/IterationStatus';
import { PublishStatus } from '@entity/PublishStatus';
import { MemberRole } from '@entity/MemberRole';
import { PublishEnvironment } from '@entity/PublishEnvironment';
import { ReviewStatus } from '@entity/ReviewStatus';
import { ReviewerScopeType } from '@entity/ReviewerScopeType';
import { UserRole } from '@entity/UserRole';
import { Department } from '@entity/Department';
import { Post } from '@entity/Post';
import { User } from '@entity/User';

const publishTypes = [
  {
    name: 'Weex 发布',
    value: '1001',
    logo:
      'https://cavszhouyou-1254093697.cos.ap-chongqing.myqcloud.com/react.png',
  },
  {
    name: 'Webapp 发布',
    value: '1002',
    logo:
      'https://cavszhouyou-1254093697.cos.ap-chongqing.myqcloud.com/html_logo.png',
  },
  {
    name: 'TNPM 发布',
    value: '1003',
    logo:
      'https://cavszhouyou-1254093697.cos.ap-chongqing.myqcloud.com/nodejs.png',
  },

  {
    name: 'Windmill 轻应用',
    value: '1004',
    logo:
      'https://cavszhouyou-1254093697.cos.ap-chongqing.myqcloud.com/css.png',
  },
  {
    name: 'Assets 覆盖发布',
    value: '1005',
    logo:
      'https://cavszhouyou-1254093697.cos.ap-chongqing.myqcloud.com/html_logo.png',
  },
  {
    name: 'Assets 非覆盖发布',
    value: '1006',
    logo:
      'https://cavszhouyou-1254093697.cos.ap-chongqing.myqcloud.com/html_logo.png',
  },
];

const productTypes = [
  {
    name: '淘系技术部 - 行业 - iHome - 家居家装导购',
    value: '2001',
  },
  {
    name: '淘系技术部 - 行业 - 极有家',
    value: '2002',
  },
  {
    name: '淘系技术部 - 行业 - 闲鱼',
    value: '2003',
  },
];

const iterationStatus = [
  {
    name: '已完成',
    value: '3001',
  },
  {
    name: '进行中',
    value: '3002',
  },
  {
    name: '已废弃',
    value: '3003',
  },
];

const publishStatus = [
  {
    name: '发布成功',
    value: '4001',
  },
  {
    name: '发布失败',
    value: '4002',
  },
  {
    name: '未发布',
    value: '4003',
  },
];

const memberRoles = [
  {
    name: '创建者',
    value: '5001',
  },
  {
    name: '管理员',
    value: '5002',
  },
  {
    name: '开发者',
    value: '5003',
  },
];

const userRoles = [
  {
    name: '用户',
    value: '6001',
  },
  {
    name: '管理员',
    value: '6002',
  },
];

const publishEnvTypes = [
  {
    name: '线上',
    value: 'online',
  },
  {
    name: '日常',
    value: 'daily',
  },
];

const reviewStatus = [
  {
    name: '通过',
    value: '7001',
  },
  {
    name: '未通过',
    value: '7002',
  },
  {
    name: '审核中',
    value: '7003',
  },
];

const reviewerScopeTypes = [
  {
    name: '仅创建者可审阅',
    value: '8001',
  },
  {
    name: '仅创建者和管理员可审阅',
    value: '8002',
  },
  {
    name: '成员均可审阅',
    value: '8003',
  },
];

const departments = [
  {
    name: '淘系技术部 - 躺平',
    value: '9001',
  },
  {
    name: '淘系技术部 - 闲鱼',
    value: '9002',
  },
  {
    name: '淘系技术部 - 村淘',
    value: '9003',
  },
  {
    name: '淘系技术部 - 天猫',
    value: '9004',
  },
];

const posts = [
  {
    name: '实习前端工程师',
    value: '11001',
  },
  {
    name: '前端工程师',
    value: '11002',
  },
  {
    name: '高级前端工程师',
    value: '11003',
  },
  {
    name: '前端专家',
    value: '11004',
  },
  {
    name: '高级前端专家',
    value: '11005',
  },
  {
    name: '资深前端专家',
    value: '11006',
  },
  {
    name: '研究员',
    value: '11007',
  },
];

const users = [
  {
    userId: '223035',
    userName: '晓天',
    userAvatar:
      'http://hd215.api.yesapi.cn/?s=Ext.Avatar.Show&nickname=%E6%99%93%E5%A4%A9&size=500&app_key=4C389AC422864EB57101E24648435351&sign=BCF78D4C895E4054AC0B231BD1DD0524',
    pwdHash: '$2b$12$1mE2OI9hMS/rgH9Mi0s85OM2V5gzm7aF3gJIWH1y0S1MqVBueyjsy',
    roleId: '6002',
    postId: '11001',
    departmentId: '9001',
  },
];

export default async function initDatabase(manager: any) {
  publishTypes.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(PublishType, {
        code: value,
        name,
      })
    );
  });

  productTypes.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(ProductType, {
        code: value,
        name,
      })
    );
  });

  iterationStatus.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(IterationStatus, {
        code: value,
        name,
      })
    );
  });

  publishStatus.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(PublishStatus, {
        code: value,
        name,
      })
    );
  });

  memberRoles.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(MemberRole, {
        roleId: value,
        roleName: name,
      })
    );
  });

  userRoles.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(UserRole, {
        roleId: value,
        roleName: name,
      })
    );
  });

  publishEnvTypes.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(PublishEnvironment, {
        code: value,
        name,
      })
    );
  });

  reviewStatus.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(ReviewStatus, {
        code: value,
        name,
      })
    );
  });

  reviewerScopeTypes.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(ReviewerScopeType, {
        code: value,
        name,
      })
    );
  });

  departments.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(Department, {
        departmentId: value,
        departmentName: name,
      })
    );
  });

  posts.forEach(async (item) => {
    const { value, name } = item;

    await manager.save(
      manager.create(Post, {
        postId: value,
        postName: name,
      })
    );
  });

  users.forEach(async (item) => {
    const { roleId, postId, departmentId } = item;

    const role = await manager.findOne(UserRole, {
      roleId,
    });

    const department = await manager.findOne(Department, {
      departmentId,
    });

    const post = await manager.findOne(Post, {
      postId,
    });

    await manager.save(
      manager.create(User, {
        ...item,
        role,
        department,
        post,
      })
    );
  });
}
