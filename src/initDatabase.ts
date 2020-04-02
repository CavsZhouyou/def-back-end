/*
 * @Author: zhouyou@werun
 * @Descriptions: 数据库初始化
 * @TodoList: 无
 * @Date: 2020-04-02 20:06:09
 * @Last Modified by: zhouyou@werun
 * @Last Modified time: 2020-04-02 20:08:01
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

const publishTypes = [
  {
    name: 'Weex 发布',
    value: '1001'
  },
  {
    name: 'Webapp 发布',
    value: '1002'
  },
  {
    name: 'TNPM 发布',
    value: '1003'
  },

  {
    name: 'Windmill 轻应用',
    value: '1004'
  },
  {
    name: 'Assets 覆盖发布',
    value: '1005'
  },
  {
    name: 'Assets 非覆盖发布',
    value: '1006'
  }
];

const productTypes = [
  {
    name: '淘系技术部 - 行业 - iHome - 家居家装导购',
    value: '2001'
  },
  {
    name: '淘系技术部 - 行业 - 极有家',
    value: '2002'
  },
  {
    name: '淘系技术部 - 行业 - 闲鱼',
    value: '2003'
  }
];

const iterationStatus = [
  {
    name: '已完成',
    value: '3001'
  },
  {
    name: '进行中',
    value: '3002'
  },
  {
    name: '已废弃',
    value: '3003'
  }
];

const publishStatus = [
  {
    name: '发布成功',
    value: '4001'
  },
  {
    name: '发布失败',
    value: '4002'
  },
  {
    name: '未发布',
    value: '4003'
  }
];

const memberRoles = [
  {
    name: '创建者',
    value: '5001'
  },
  {
    name: '管理员',
    value: '5002'
  },
  {
    name: '开发者',
    value: '5003'
  }
];

const userRoles = [
  {
    name: '用户',
    value: '6001'
  },
  {
    name: '管理员',
    value: '6002'
  }
];

const publishEnvTypes = [
  {
    name: '线上',
    value: 'online'
  },
  {
    name: '日常',
    value: 'daily'
  }
];

const reviewStatus = [
  {
    name: '通过',
    value: '7001'
  },
  {
    name: '未通过',
    value: '7002'
  },
  {
    name: '审核中',
    value: '7003'
  }
];

const reviewerScopeTypes = [
  {
    name: '仅创建者可审阅',
    value: '8001'
  },
  {
    name: '仅创建者和管理员可审阅',
    value: '8002'
  },
  {
    name: '成员均可审阅',
    value: '8003'
  }
];

export default async function initDatabase(manager: any) {
  publishTypes.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(PublishType, {
        code: value,
        name
      })
    );
  });

  productTypes.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(ProductType, {
        code: value,
        name
      })
    );
  });

  iterationStatus.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(IterationStatus, {
        code: value,
        name
      })
    );
  });

  publishStatus.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(PublishStatus, {
        code: value,
        name
      })
    );
  });

  memberRoles.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(MemberRole, {
        roleId: value,
        roleName: name
      })
    );
  });

  userRoles.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(UserRole, {
        roleId: value,
        roleName: name
      })
    );
  });

  publishEnvTypes.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(PublishEnvironment, {
        code: value,
        name
      })
    );
  });

  reviewStatus.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(ReviewStatus, {
        code: value,
        name
      })
    );
  });

  reviewerScopeTypes.forEach(async item => {
    const { value, name } = item;

    await manager.save(
      manager.create(ReviewerScopeType, {
        code: value,
        name
      })
    );
  });
}
